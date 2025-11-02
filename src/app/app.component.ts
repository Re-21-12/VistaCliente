import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NavigationService } from './core/services/navigation.service';
import { NavigationSection } from './core/interfaces/navigation.interface';
import { GlobalLoaderComponent } from './shared/components/global-loader/global-loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, GlobalLoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _navigationService = inject(NavigationService);
  readonly _router = inject(Router);

  title = 'frontTablero';
  isDarkMode = signal(true);
  sidebarOpen = signal(false);
  navigationSections = signal<NavigationSection[]>([]);

  ngOnInit() {
    this.setInitialTheme();
    this.loadNavigation();
  }

  private loadNavigation() {
  // Si tu servicio es async, cambia esta línea por:
  // const raw = await this._navigationService.getFilteredNavigation();
  const raw = this._navigationService.getFilteredNavigation() ?? [];

  // Normaliza y filtra items "de cliente" (no admin)
  const CLIENT_ROUTES = new Set<string>([
    '/bienvenida',
    '/resultado',
    '/tablero',
    '/equipos',
    '/partidos',
    '/jugadores',
    '/historial',
  ]);
  const toRoute = (it: any): string => (it?.route ?? '');
  const isClientItem = (item: any) => {
    if (!item) return false;
    if (item?.meta?.isAdmin === true || item?.meta?.admin === true) return false;
    const r = toRoute(item);
    if (!r || typeof r !== 'string') return false;
    if (r.startsWith('/admin')) return false;
    return CLIENT_ROUTES.has(r);
  };

  const filtered = (raw as NavigationSection[])
    .map(sec => ({
      ...sec,
      items: Array.isArray(sec?.items) ? sec.items.filter(isClientItem) : []
    }))
    .filter(sec => Array.isArray(sec.items) && sec.items.length > 0);
  const perfilSection: NavigationSection = {
    title: 'Cuenta',
    items: [{ label: 'Inicio', route: '/bienvenida' } as any],
  };

  const sections: NavigationSection[] = [...filtered];
  let marcador = sections.find(s => (s?.title ?? '').trim().toLowerCase() === 'marcador');
  if (!marcador) {
    marcador = { title: 'Marcador', items: [] };
    sections.unshift(marcador);
  } else {
    marcador.items = [...(marcador.items ?? [])];
  }

  const wantOrder: Array<{ label: string; route: string }> = [
    { label: 'Equipos',   route: '/equipos'   },
    { label: 'Partidos',  route: '/partidos'  },
    { label: 'Jugadores', route: '/jugadores' },
  ];

  const byRoute = new Map<string, { label: string; route: string }>();
  for (const it of marcador.items) {
    const r = toRoute(it);
    if (r) byRoute.set(r, { label: it.label ?? r.replace('/', ''), route: r });
  }
  for (const it of wantOrder) {
    if (!byRoute.has(it.route)) byRoute.set(it.route, it);
  }
  marcador.items = [
    ...wantOrder.map(it => byRoute.get(it.route)!).filter(Boolean),
    ...[...byRoute.values()].filter(v => !wantOrder.some(w => w.route === v.route)),
  ];

  this.navigationSections.set([perfilSection, ...sections]);
}


  private setInitialTheme() {
    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    let useDark: boolean;
    if (saved === 'dark') useDark = true;
    else if (saved === 'light') useDark = false;
    else if (systemDark) useDark = true;
    else {
      const hour = new Date().getHours();
      useDark = hour >= 18 || hour < 6;
    }
    this.isDarkMode.set(useDark);
    this.applyTheme();
    if (!saved && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        this.isDarkMode.set(e.matches);
        this.applyTheme();
      };
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else (mq as any).addListener?.(handler);
    }
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    const root = document.documentElement;
    root.classList.remove('dark-theme', 'light-theme');
    root.classList.add(this.isDarkMode() ? 'dark-theme' : 'light-theme');
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) meta.content = this.isDarkMode() ? '#0b1224' : '#ffffff';
  }

  toggleSidebar() {
    this.sidebarOpen.update(current => !current);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  onSidebarClick(event: Event) {
    event.stopPropagation();
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/inicio_sesion']);
  }

  get isAuthenticated(): boolean {
    return this._authService.isAuthenticated();
  }

  get shouldShowNavigation(): boolean {
    return this.isAuthenticated && this.navigationSections().length > 0;
  }

  getCurrentSectionName(): string {
    const currentUrl = this._router.url;
    if (currentUrl.startsWith('/admin')) return 'Administración';
    if (currentUrl.startsWith('/recursos')) return 'Recursos';
    if (currentUrl.includes('/tablero') || currentUrl.includes('/resultado')) return 'Marcador';
    return 'Marcador';
  }
}
