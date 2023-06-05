import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

//Angular Calendar
import { CalendarModule } from 'angular-calendar';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
//Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSidenavModule } from '@angular/material/sidenav';
//Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Components
import { NavComponent } from './components/homepage/nav/nav.component';
import { BottomNavComponent } from './components/homepage/bottom-nav/bottom-nav.component';
import { AuthComponent } from './components/authentication/register/signup-google/auth.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { HomeComponent } from './components/homepage/home/home.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { MaterialElevationDirective } from './custom-style/material-elevation.directive';
import { LayoutComponent } from './components/homepage/layout/layout.component';
import { BottomLayoutComponent } from './components/homepage/bottom-layout/bottom-layout.component';
import { CompletePaymentComponent } from './components/authentication/register/complete-payment/complete-payment.component';
import { ProvideInformationComponent } from './components/authentication/register/provide-information/provide-information/provide-information.component';
import { PublicCalendarComponent } from './components/public/public-booking-slots/public-calendar.component';
import { ReschedulePublicCalendarComponent } from './components/public/reschedule-booking-slots/reschedule-public-calendar.component';
//Angular Authentication
import { AuthInterceptor } from './_authentication/auth.interceptor';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';

//Angular FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';

//Other libary packages
import { ToastrModule } from 'ngx-toastr';

//Service
import { CalendarService } from './_services/calendar.service';
import { UserService } from './_services/user.service';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BottomNavComponent,
    AuthComponent,
    LoginComponent,
    HomeComponent,
    ForbiddenComponent,
    PricingComponent,
    CompletePaymentComponent,
    ProvideInformationComponent,
    MaterialElevationDirective,
    LayoutComponent,
    PublicCalendarComponent,
    ReschedulePublicCalendarComponent,
    BottomLayoutComponent,
  ],
  imports: [
    //Angular Material Modules
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatExpansionModule,
    MatRadioModule,
    MatBottomSheetModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatSidenavModule,
    NgbModule,
    ToastrModule.forRoot(),

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
    UserService,
    CalendarService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
