import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//Components
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WrapperComponent } from './homepage/wrapper/wrapper.component';
import { CalendarComponent } from './calendar/all-schedule-list/calendar.component';
import { BookingEventsComponent } from './booking/booking-events/booking-events.component';
import { ActiveCalendarComponent } from './calendar/active-calendar/active-calendar.component';
import { DetailScheduleComponent } from './calendar/detail-schedule/detail-schedule.component';
import { CreateBookingComponent } from './booking/create-booking/create-booking.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { InvitePartnersComponent } from './shared/invite-partners/invite-partners.component';
import { PublicPopupComponent } from './popup/public-popup/public-popup.component';
import { PopupTemplateComponent } from './popup/popup-template/popup-template.component';
import { PublicCalendarComponent } from './shared/public-calendar/public-calendar.component';
import { PrivateCalendarComponent } from './shared/private-calendar/private-calendar.component';
import { ModifyEventComponent } from './popup/modify-event/modify-event.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { GoogleAuthenComponent } from './authentication/google-authen/google-authen.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { FreeSlotsComponent } from './calendar/free-slots/free-slots.component';
import { CustomPopupComponent } from './popup/custom-popup/custom-popup.component';

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
// import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortable } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
// import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatCheckboxModule } from '@angular/material/checkbox';

//Angular FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../_authentication/auth.interceptor';
import { CreateScheduleComponent } from './calendar/create-schedule/create-schedule.component';

//Bootstrap Module
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Other library packages Module
import { ToastrModule } from 'ngx-toastr';
import { timeout } from 'rxjs';
import { AddEmployeeComponent } from './organization/resources/add-employee/add-employee.component';
import { AddCalendarComponent } from './organization/resources/add-calendar/add-calendar.component';
import { AddDeviceComponent } from './organization/devices/add-device/add-device.component';
import { UserProfileComponent } from './organization/resources/user-profile/user-profile.component';
import { OrgDashboardComponent } from './organization/org-dashboard/org-dashboard.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MaterialElevationDirective } from '../custom-style/material-elevation2.directive';
import { BookingResourcesComponent } from './organization/resources/booking-resources/booking-resources.component';
const lang = 'en-US';

const plugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

@NgModule({
  declarations: [
    WrapperComponent,
    CalendarComponent,
    CreateScheduleComponent,
    ActiveCalendarComponent,
    DetailScheduleComponent,
    BookingEventsComponent,
    CreateBookingComponent,
    ProfileComponent,
    InvitePartnersComponent,
    PrivateCalendarComponent,
    PublicPopupComponent,
    PopupTemplateComponent,
    PublicCalendarComponent,
    ModifyEventComponent,
    GoogleAuthenComponent,
    AdminDashboardComponent,
    FreeSlotsComponent,
    CustomPopupComponent,
    AddEmployeeComponent,
    AddCalendarComponent,
    AddDeviceComponent,
    UserProfileComponent,
    OrgDashboardComponent,
    MaterialElevationDirective,
    BookingResourcesComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    CommonModule,
    // Angular Material Modules
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    // MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatPaginatorModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatExpansionModule,
    ClipboardModule,
    MatRadioModule,
    MatGridListModule,
    MatTooltipModule,
    MatTabsModule,
    // Full Calendar
    FullCalendarModule,
    //Bootstrap
    NgbModule,
    ToastrModule.forRoot(),
    //Other library packages module
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: lang,
    },
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
