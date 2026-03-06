import { Component, signal, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Entete } from './features/entete/entete';
import { Contenu } from './features/contenu/contenu';
import { Menu } from './shared/components/menu/menu';
import { LayoutService } from './core/services/layout.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [Entete, Contenu, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('AEL');
  isLoggedIn = signal(false);

  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté au démarrage
    this.checkLoginStatus();

    // Écouter les changements de route pour mettre à jour le statut de connexion
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.checkLoginStatus();
    });
  }

  private checkLoginStatus() {
    const token = this.authService.getAccessToken();
    const loggedIn = !!token;
    console.log('App - Token trouvé:', token ? 'Oui' : 'Non');
    console.log('App - isLoggedIn:', loggedIn);
    this.isLoggedIn.set(loggedIn);
    this.layoutService.setLoggedIn(loggedIn);
    this.cdr.detectChanges();
  }
}
