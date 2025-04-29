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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'upload', component: UploadImageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'map', component: MapComponent },
  { path: 'compare', component: CompareComponent },
  { path: 'panels', component: PanelsComponent },
  { path: 'panels/manage', component: PanelsmanagementComponent },


  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'quick-check', redirectTo: 'upload', pathMatch: 'full' }

];
