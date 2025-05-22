import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UploadImageComponent } from './pages/upload-image/upload-image.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {MapComponent} from './pages/map/map.component';
import {CompareComponent} from './pages/compare/compare.component';
import {PanelsComponent} from './pages/panels/panels.component';
import {PanelsmanagementComponent} from './pages/panelsmanagement/panelsmanagement.component';
import {GuestGuard} from './guards/guest/guest.guard';
import {AuthGuard} from './guards/auth/auth.guard';
import {PanelHistoryComponent} from './pages/panel-history/panel-history.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'upload', component: UploadImageComponent },


  // Guest only
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },

  // Authenticated users
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'panels', component: PanelsComponent, canActivate: [AuthGuard] },
  { path: 'panels/manage', component: PanelsmanagementComponent, canActivate: [AuthGuard] },
  { path: 'panels/history', component: PanelHistoryComponent, canActivate: [AuthGuard] },

  // Redirect logic
  { path: 'quick-check', redirectTo: 'upload', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
