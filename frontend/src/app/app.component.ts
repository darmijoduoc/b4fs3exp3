import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';     // 👈 Necesario para *ngIf, *ngFor
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';      // 👈 Necesario para <router-outlet>         // ✅ Modelo desde /models
import { SessionService } from './services/session.service';
import { Session } from './models/session';

// ===================================================================
// Decorador principal del componente raíz de Angular
// ===================================================================
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'labs-angular';
  loading = true;
  error = '';

  loggedIn = false;
  session: Session | null = null;
  rol: 'ADMIN' | 'WORKER' | null = null;


  constructor(private sessionService: SessionService) {}


  ngOnInit(): void {
    this.sessionService.isLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      this.sessionService.getSession().subscribe(session => this.session = session);
    });
  }

  isAdmin(): boolean {
    return this.session?.rol === 'ADMIN';
  }

  isWorker(): boolean {
    return this.session?.rol === 'WORKER';
  }
}
