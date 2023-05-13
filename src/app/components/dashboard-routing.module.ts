import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/all-schedule-list/calendar.component';
import { WrapperComponent } from './homepage/wrapper/wrapper.component';
import { ActiveCalendarComponent } from './calendar/active-calendar/active-calendar.component';
import { BookingEventsComponent } from './booking/booking-events/booking-events.component';
import { CreateBookingComponent } from './booking/create-booking/create-booking.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { CreateScheduleComponent } from './calendar/create-schedule/create-schedule.component';
import { InvitePartnersComponent } from './shared/invite-partners/invite-partners.component';
import { PublicCalendarComponent } from './shared/public-calendar/public-calendar.component';
import { PrivateCalendarComponent } from './shared/private-calendar/private-calendar.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserProfileComponent } from './organization/resources/user-profile/user-profile.component';
import { OrgDashboardComponent } from './organization/org-dashboard/org-dashboard.component';
import { AddEmployeeComponent } from './organization/resources/add-employee/add-employee.component';
import { AddDeviceComponent } from './organization/devices/add-device/add-device.component';
//Angular Calendar
import { CalendarModule } from 'angular-calendar';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BookingResourcesComponent } from './organization/resources/booking-resources/booking-resources.component';
import { ApproveDashboardComponent } from './organization/resources/approve-dashboard/approve-dashboard.component';
const routes: Routes = [
  // Sidenav-Wrapper Component acts like a shell & the active child Component gets rendered into the <router-outlet>
  {
    path: '',
    component: WrapperComponent,
    children: [
      {
        path: 'booking-events',
        component: BookingEventsComponent,
      },
      {
        path: 'create-calendar',
        component: CreateScheduleComponent,
      },
      {
        path: 'active-calendar',
        component: ActiveCalendarComponent,
      },
      {
        path: 'all-schedule',
        component: CalendarComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'invite-partners',
        component: InvitePartnersComponent,
      },
      {
        path: 'public-calendar/:pathMapping',
        component: PublicCalendarComponent,
      },
      {
        path: 'private',
        component: PrivateCalendarComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'organization-overview',
        component: OrgDashboardComponent,
      },
      {
        path: 'employee',
        component: AddEmployeeComponent,
      },
      {
        path: 'device',
        component: AddDeviceComponent,
      },
      {
        path: 'booking-resource',
        component: BookingResourcesComponent,
      },
      {
        path: 'approve-dashboard',
        component: ApproveDashboardComponent,
      },
    ],
  },
  {
    path: '*',
    redirectTo: '/calendar-dashboard',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
