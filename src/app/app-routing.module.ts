import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveDashboardComponent } from './approve-dashboard/approve-dashboard.component';
import { AuthComponent } from './components/authentication/register/auth.component';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';
import { HomeComponent } from './components/homepage/home/home.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthGuard } from './_authentication/auth.guard';

const routes: Routes = [

  // {path: 'login-outlook',component: LoginComponent,},
  {path: 'login',component: LoginComponent},
  {path: 'register',component: AuthComponent,},

  {path: 'approve-dashboard',component: ApproveDashboardComponent,
   canActivate: [AuthGuard],
   data: {role:'ROLE_ADMIN'},
  },
  {path: 'homepage', 
   loadChildren: () => import('./components/dashboard.module').then(m => m.DashboardModule),
   canActivate: [AuthGuard], 
   data: {role:'ROLE_BASIC_USER'}
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
