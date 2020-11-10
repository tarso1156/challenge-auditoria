import { Routes } from '@angular/router';

import { AuthGuard } from './core/auth.guard';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuditComponent } from './audit/audit.component';
import { AuditorComponent } from './auditor/auditor.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [ AuthGuard ] },
  { path: 'audit', component: AuditComponent, canActivate: [ AuthGuard ] },
  { path: 'audit/:key', component: AuditComponent, canActivate: [ AuthGuard ] },
  { path: 'auditor', component: AuditorComponent, canActivate: [ AuthGuard ] },
];
