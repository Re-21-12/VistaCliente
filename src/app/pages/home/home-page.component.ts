import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
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
  private _activatedRoute = inject(ActivatedRouteSnapshot);
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
    const id = this._activatedRoute.params['id'];
    if (id) {
      this._socket.on(`partido`, `${id}`, (data) => {
        this._notify.info(`Partido actualizado: ${data}`);
      });
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
