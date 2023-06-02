import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/authentication/register/signup-google/auth.component';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';
import { HomeComponent } from './components/homepage/home/home.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthGuard } from './_authentication/auth.guard';
import { GoogleAuthenComponent } from './components/authentication/google-authen/google-authen.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { ProvideInformationComponent } from './components/authentication/register/provide-information/provide-information/provide-information.component';
import { CompletePaymentComponent } from './components/authentication/register/complete-payment/complete-payment.component';
import { PublicCalendarComponent } from './components/shared/public-calendar/public-calendar.component';
import { PublicEventDetailsComponent } from './components/organization/events/internal-events/public-event-details/public-event-details/public-event-details.component';
import { PublicOrganizationEventComponent } from './components/public-organization-event/public-organization-event.component';
import { ReschedulePublicCalendarComponent } from './components/shared/reschedule-public-calendar/reschedule-public-calendar.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: AuthComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'payment-processing', component: CompletePaymentComponent },
  { path: 'provide-info', component: ProvideInformationComponent },
  {
    path: 'homepage',
    loadChildren: () =>
      import('./components/dashboard.module').then((m) => m.DashboardModule),
    // canActivate: [AuthGuard],
    data: { role: 'ROLE_BASIC_USER' },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' },
  },

  {
    path: 'authorize/oauth2/user/callback',
    component: GoogleAuthenComponent,
  },
  {
    path: 'public-event',
    component: PublicOrganizationEventComponent,
  },
  {
    path: 'public-calendar',
    component: PublicCalendarComponent,
  },
  {
    path: 'public-event/event-detail',
    component: PublicEventDetailsComponent,
  },
  {
    path: 'public-event/reschedule-event',
    component: ReschedulePublicCalendarComponent,
  },
  { path: 'forbidden', component: ForbiddenComponent },
  {
    path: '',
    component: HomeComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  // {path: 'calendar',component: CalendarTemplateComponent,}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
