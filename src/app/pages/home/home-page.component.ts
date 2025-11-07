import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { TableroService } from '../../core/services/tablero.service';
import { LocalidadService } from '../../core/services/localidad.service';
import { SocketService } from '../../core/services/socket.service';
import { NotifyService } from '../shared/notify.service';

type Possession = 'local' | 'visit' | 'none';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  private _tableroService = inject(TableroService);
  private _localidadService = inject(LocalidadService);

  scoreLocal = signal(0);
  foulsLocal = signal(0);
  scoreVisit = signal(0);
  foulsVisit = signal(0);
  quarter = signal(1);
  timerSeconds = signal(10 * 60);

  locNombre = '';
  equipoLocalNombre = '';
  equipoVisitNombre = '';

  private _shot = signal(24);
  private _backcourt = signal<number | null>(null);
  private _possession = signal<Possession>('none');
  // indicador visual breve cuando llegan datos por websocket
  updateFlash = signal(false);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _socket = inject(SocketService);
  private _notify = inject(NotifyService);

  ngOnInit(): void {
    const s = this._tableroService.getEquiposSeleccionados() ?? [];
    const locId = s[0]?.id_localidad;
    if (locId)
      this._localidadService
        .get(locId)
        .subscribe((l) => (this.locNombre = l?.nombre ?? ''));
    this.equipoLocalNombre = s[0]?.nombre ?? '';
    this.equipoVisitNombre = s[1]?.nombre ?? '';
    this.startListen();
  }
  startListen() {
    const id = this._activatedRoute.snapshot.params['id'];
    if (id) {
      this._socket.on(`partido`, `${id}`, (data) => {
        // Intento de mapeo tolerante: buscamos donde haya los valores más apropiados
        try {
          this._applySocketData(data);
          this._notify.info(`Partido actualizado`);
        } catch (err) {
          // no queremos romper la app por un payload inesperado
          console.error('Error aplicando datos del socket:', err, data);
          this._notify.info(`Partido actualizado (datos parciales)`);
        }
      });
    }
  }

  private _applySocketData(data: any) {
    if (!data || typeof data !== 'object') return;

    // Helper para obtener número a partir de múltiples nombres posibles
    const getNumber = (...keys: string[]) => {
      for (const k of keys) {
        const v =
          data[k] ?? data?.Local?.[k] ?? data?.Visitante?.[k] ?? undefined;
        if (v == null) continue;
        const n = Number(v);
        if (!Number.isNaN(n)) return n;
      }
      return null;
    };

    const getString = (...paths: string[]) => {
      for (const p of paths) {
        // allow nested like 'Local.Nombre'
        const parts = p.split('.');
        let cur: any = data;
        for (const part of parts) {
          if (cur == null) break;
          cur = cur[part];
        }
        if (cur != null) return String(cur);
      }
      return null;
    };

    // Nombres de equipos y localidad
    const localName = getString(
      'Local.Nombre',
      'Local.nombre',
      'Local.NOMBRE',
      'Localidad.Nombre',
      'localidad.nombre',
    );
    const visitName = getString(
      'Visitante.Nombre',
      'Visitante.nombre',
      'Visitante.NOMBRE',
    );
    const locName = getString(
      'localidad.nombre',
      'localidad',
      'Local.Localidad.nombre',
      'Local.Localidad',
      'Localidad',
    );

    if (localName) this.equipoLocalNombre = localName;
    if (visitName) this.equipoVisitNombre = visitName ?? this.equipoVisitNombre;
    if (locName) this.locNombre = locName;

    // Marcadores (intento con varias claves comunes)
    const scoreL = getNumber(
      'scoreLocal',
      'ScoreLocal',
      'PuntosLocal',
      'puntos_local',
      'Local.score',
      'Local.Puntos',
      'Local.PuntosTotales',
    );
    const scoreV = getNumber(
      'scoreVisit',
      'ScoreVisit',
      'PuntosVisitante',
      'puntos_visit',
      'Visitante.score',
      'Visitante.Puntos',
      'Visitante.PuntosTotales',
    );
    if (scoreL != null) this.scoreLocal.set(scoreL);
    if (scoreV != null) this.scoreVisit.set(scoreV);

    // Faltas
    const foulsL = getNumber(
      'faltasLocal',
      'FaltasLocal',
      'Faltas_Local',
      'Local.faltas',
      'Local.Faltas',
    );
    const foulsV = getNumber(
      'faltasVisit',
      'FaltasVisit',
      'Faltas_Visitante',
      'Visitante.faltas',
      'Visitante.Faltas',
    );
    if (foulsL != null) this.foulsLocal.set(foulsL);
    if (foulsV != null) this.foulsVisit.set(foulsV);

    // Cuarto / periodo
    const quarterNum = getNumber(
      'quarter',
      'period',
      'Periodo',
      'Cuarto',
      'quarterNumber',
    );
    if (quarterNum != null) this.quarter.set(quarterNum);

    // Timer: puede venir en segundos numéricos o en string mm:ss
    const tryTimer = () => {
      const t1 =
        data['timerSeconds'] ??
        data['timer'] ??
        data['Tiempo'] ??
        data['tiempo'] ??
        data['TiempoRestante'];
      if (t1 != null) {
        if (typeof t1 === 'number') return Math.floor(t1);
        if (typeof t1 === 'string') {
          // si viene como "mm:ss"
          const mmss = t1.match(/(\d+):(\d+)/);
          if (mmss) return Number(mmss[1]) * 60 + Number(mmss[2]);
          const asNum = Number(t1);
          if (!Number.isNaN(asNum)) return Math.floor(asNum);
        }
      }
      // buscar en rutas comunes
      const candidates = [
        'TiempoRestante',
        'TimeLeft',
        'timeRemaining',
        'TimeRemaining',
        'Tiempo',
      ];
      for (const c of candidates) {
        const v = data[c] ?? data?.Local?.[c] ?? data?.Visitante?.[c];
        if (v == null) continue;
        if (typeof v === 'number') return Math.floor(v);
        if (typeof v === 'string') {
          const mmss = v.match(/(\d+):(\d+)/);
          if (mmss) return Number(mmss[1]) * 60 + Number(mmss[2]);
          const asNum = Number(v);
          if (!Number.isNaN(asNum)) return Math.floor(asNum);
        }
      }
      return null;
    };

    const timer = tryTimer();
    if (timer != null) this.timerSeconds.set(timer);

    // Shot clock
    const shot = getNumber('shotClock', 'ShotClock', 'Ataque', 'shot');
    if (shot != null) this._shot.set(shot);

    // Backcourt / 8s
    const back = getNumber(
      'backcourt',
      'backcourtSeconds',
      'eightSeconds',
      '8s',
      'ocho',
    );
    if (back != null) this._backcourt.set(back);

    // Posesión: normalizamos varios formatos
    const rawPos =
      data['possession'] ??
      data['posesion'] ??
      data['posesión'] ??
      data['Posecion'] ??
      data['Poseción'] ??
      data['pose'];
    if (rawPos != null) {
      const p = String(rawPos).toLowerCase();
      if (p === 'local' || p === 'l' || p === 'home' || p === '1')
        this._possession.set('local');
      else if (
        p === 'visit' ||
        p === 'visitante' ||
        p === 'v' ||
        p === 'away' ||
        p === '2'
      )
        this._possession.set('visit');
      else this._possession.set('none');
    }
    // mostrar indicador visual breve cuando lleguen datos
    this._flashUpdate();
  }

  private _flashUpdate() {
    try {
      this.updateFlash.set(true);
      setTimeout(() => this.updateFlash.set(false), 900);
    } catch (err) {
      console.error('Error mostrando indicador de actualización', err);
    }
  }
  possession() {
    return this._possession();
  }
  possessionIsLeftOn() {
    return this._possession() === 'local';
  }
  possessionIsRightOn() {
    return this._possession() === 'visit';
  }
  possessionLabel() {
    const p = this._possession();
    return p === 'local' ? 'Local' : p === 'visit' ? 'Visitante' : 'None';
  }

  shotClock() {
    return this._shot();
  }
  showBackcourt8() {
    return this._backcourt() !== null;
  }
  backcourtSeconds() {
    return this._backcourt() ?? 0;
  }

  mmSS(s: number) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  volverPerfil() {
    this._router.navigate(['/bienvenida']);
  }
}
