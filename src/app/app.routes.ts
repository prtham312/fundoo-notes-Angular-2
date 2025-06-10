import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'notes', pathMatch: 'full' },

      {
        path: 'notes',
        loadComponent: () =>
          import('./components/note-input/note-input.component').then(
            (m) => m.NoteInputComponent
          ),
      },
      {
        path: 'reminders',
        loadComponent: () =>
          import('./components/reminders/reminders.component').then(
            (m) => m.RemindersComponent
          ),
      },
      {
        path: 'archive',
        loadComponent: () =>
          import('./components/archive/archive.component').then(
            (m) => m.ArchiveComponent
          ),
      },
      {
        path: 'trash',
        loadComponent: () =>
          import('./components/trash/trash.component').then(
            (m) => m.TrashComponent
          ),
      },
    ],
  },
];
