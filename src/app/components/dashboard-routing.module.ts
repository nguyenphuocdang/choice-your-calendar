import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperComponent } from './homepage/wrapper/wrapper.component';
import { ActiveCalendarComponent } from './organization/active-calendar/active-calendar.component';
import { PublicCalendarComponent } from './public/public-booking-slots/public-calendar.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserProfileComponent } from './organization/employee/user-profile/user-profile.component';
import { OrgDashboardComponent } from './organization/org-dashboard/org-dashboard.component';
import { AddEmployeeComponent } from './organization/employee/add-employee/add-employee.component';
import { AddDeviceComponent } from './organization/devices/add-device/add-device.component';
//Angular Calendar
import { CalendarModule } from 'angular-calendar';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BookingResourcesComponent } from './organization/booking-resources/booking-resources.component';
import { ApproveDashboardComponent } from './organization/devices/approve-dashboard/approve-dashboard.component';
import { PublicEventsComponent } from './organization/events/public-sharing-slots/public-events.component';
import { InternalEventsComponent } from './organization/events/organization-events/internal-events.component';
const routes: Routes = [
  // Sidenav-Wrapper Component acts like a shell & the active child Component gets rendered into the <router-outlet>
  {
    path: '',
    component: WrapperComponent,
    children: [
      {
        path: 'active-calendar',
        component: ActiveCalendarComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      // {
      //   path: 'public-calendar/:pathMapping',
      //   component: PublicCalendarComponent,
      // },
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
        path: 'device/approve-dashboard',
        component: ApproveDashboardComponent,
      },
      {
        path: 'public-sharing-slots',
        component: PublicEventsComponent,
      },
      // {
      //   path: 'company-events/event-detail/:pathMapping/:shareCode',
      //   component: InternalEventsComponent,
      // },
      {
        path: 'company-events',
        component: InternalEventsComponent,
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
