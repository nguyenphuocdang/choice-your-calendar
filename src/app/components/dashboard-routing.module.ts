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
          component: ProfileComponent,
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
        }
      ],
      
    },
    {
      path: '*',
      redirectTo: '/calendar-dashboard',
      pathMatch: 'full'
    }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DashboardRoutingModule { }