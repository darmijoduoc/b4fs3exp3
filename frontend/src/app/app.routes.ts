// ======================================================================
// Semana 3 - Configuración inicial de rutas (app.routes.ts)
// ======================================================================
//
// Angular 17 usa arquitectura standalone, así que las rutas se definen
// en este arreglo sin necesidad de NgModules.
// se conectan en app.config.ts
// con provideRouter(routes).
//
// Cada entrada indica:
//   path: URL relativa (por ejemplo 'libros')
//   component: componente standalone a mostrar
//
// El sistema SPA (Single Page Application) de Angular usará <router-outlet>
// para cargar estos componentes dinámicamente.
// Rutas definidas:
//   /libros           → Listado (GET todos)
//   /libros/nuevo     → Crear (POST)
//   /libros/editar/:id→ Editar (PUT) usando el mismo form
//   /libros/:id       → Detalle (GET por ID) para visibilidad del requisito
//   '' → redirección inicial a /libros
// ======================================================================

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LabsComponent } from './components/labs/labs.component';
import { ResultsComponent } from './components/results/results.component';


export const routes: Routes = [
    {
        path: '', // Ruta raíz (http://localhost:4200)
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'labs',
        component: LabsComponent
    },
    {
        path: 'results',
        component: ResultsComponent
    },
    { path: '**', redirectTo: '/' }


];
