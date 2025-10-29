import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type UserInfo = { nombre: string } | null;

@Component({
  standalone: true,
  selector: 'app-bienvenida-pages',
  imports: [CommonModule],
  templateUrl: './bienvenida-page.component.html',
  styleUrls: ['./bienvenida-page.component.css'],
})
export class BienvenidaPagesComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = signal<UserInfo>(null);

  nombre = computed(() => this.user()?.nombre ?? 'Usuario');

  horaSaludo = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  });

  initials = computed(() => {
    const n = (this.nombre() || '').trim().split(/\s+/).slice(0, 2);
    return (n[0]?.[0] ?? '?') + (n[1]?.[0] ?? '');
  });

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/inicio_sesion']);
      return;
    }
    const current = this.auth.getCurrentUser?.();
    this.user.set(current ? { nombre: current.nombre } : null);
    if (!this.user()) this.router.navigate(['/inicio_sesion']);
  }

  ir(path: string): void {
    this.router.navigateByUrl(path); // Opción B: navegación directa
  }

  cambiarCuenta(): void {
    try { this.auth.logout?.(); } catch {}
    this.router.navigate(['/inicio_sesion']);
  }
}
