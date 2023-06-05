import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//Components
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WrapperComponent } from './homepage/wrapper/wrapper.component';
import { ActiveCalendarComponent } from './organization/calendar/active-calendar/active-calendar.component';
import { PopupTemplateComponent } from './popup/popup-template/popup-template.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { GoogleAuthenComponent } from './authentication/google-authen/google-authen.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { CustomPopupComponent } from './popup/custom-popup/custom-popup.component';

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
// import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatChipsModule } from '@angular/material/chips';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../_authentication/auth.interceptor';
//Bootstrap Module
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Other library packages Module
import { ToastrModule } from 'ngx-toastr';
import { AddEmployeeComponent } from './organization/employee/add-employee/add-employee.component';
import { AddDeviceComponent } from './organization/devices/add-device/add-device.component';
import { UserProfileComponent } from './organization/employee/user-profile/user-profile.component';
import { OrgDashboardComponent } from './organization/org-dashboard/org-dashboard.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MaterialElevationDirective } from '../custom-style/material-elevation2.directive';
import { BookingResourcesComponent } from './organization/booking-resources/booking-resources.component';
import { ApproveDashboardComponent } from './organization/devices/approve-dashboard/approve-dashboard.component';
import { PublicEventsComponent } from './organization/events/public-sharing-slots/public-events.component';
import { InternalEventsComponent } from './organization/events/organization-events/internal-events.component';
import { EventDetailComponent } from './organization/events/event-detail/event-detail.component';
import { PublicEventDetailsComponent } from './public/public-event-details/public-event-details.component';
import { PublicOrganizationEventComponent } from './public/public-organization-event/public-organization-event.component';
import { ReschedulePublicSharingSlotsComponent } from './organization/events/reschedule-public-sharing-slots/reschedule-public-sharing-slots.component';
import { ResourceCalendarComponent } from './organization/calendar/resource-calendar/resource-calendar.component';
const lang = 'en-US';

@NgModule({
  declarations: [
    WrapperComponent,
    ActiveCalendarComponent,
    PopupTemplateComponent,
    GoogleAuthenComponent,
    AdminDashboardComponent,
    CustomPopupComponent,
    AddEmployeeComponent,
    AddDeviceComponent,
    UserProfileComponent,
    OrgDashboardComponent,
    MaterialElevationDirective,
    BookingResourcesComponent,
    ApproveDashboardComponent,
    PublicEventsComponent,
    InternalEventsComponent,
    EventDetailComponent,
    PublicEventDetailsComponent,
    PublicOrganizationEventComponent,
    ReschedulePublicSharingSlotsComponent,
    ResourceCalendarComponent,
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
    MatBadgeModule,
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
    MatBottomSheetModule,
    MatTooltipModule,
    MatTabsModule,
    // Full Calendar
    MatChipsModule,
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
