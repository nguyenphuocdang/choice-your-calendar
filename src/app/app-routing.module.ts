import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/authentication/register/auth.component';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';
import { HomeComponent } from './components/homepage/home/home.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthGuard } from './_authentication/auth.guard';
import { GoogleAuthenComponent } from './components/authentication/google-authen/google-authen.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

const routes: Routes = [

  // {path: 'login-outlook',component: LoginComponent,},
  {path: 'login',component: LoginComponent},
  {path: 'register',component: AuthComponent,},

  // {path: 'approve-dashboard',component: AdminDashboardComponent,
  //  canActivate: [AuthGuard],
  //  data: {role:'ROLE_ADMIN'},
  // },

  {path: 'homepage', 
   loadChildren: () => import('./components/dashboard.module').then(m => m.DashboardModule),
   canActivate: [AuthGuard], 
   data: {role:'ROLE_BASIC_USER'}
  },

  {path: 'admin', 
  loadChildren: () => import('./components/dashboard.module').then(m => m.DashboardModule),
  canActivate: [AuthGuard], 
  data: {role:'ROLE_ADMIN'}
 },

  {
    path: 'authorize/oauth2/user/callback',
    component: GoogleAuthenComponent,
  },

  {path: 'forbidden',component: ForbiddenComponent},
  {
    path: '',component: HomeComponent,
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
  // {path: 'calendar',component: CalendarTemplateComponent,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      initialNavigation:'enabledBlocking',
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
