import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

//Angular Material
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';

//Bootstrap
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import { NgbNavModule, NgbCollapseModule, NgbTooltipModule,} from '@ng-bootstrap/ng-bootstrap';

//Components
import { NavComponent } from './components/homepage/nav/nav.component';
import { AuthComponent } from './components/authentication/register/auth.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ApproveDashboardComponent } from './approve-dashboard/approve-dashboard.component';
import { HomeComponent } from './components/homepage/home/home.component';

//Azure MSAL
// import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MSAL_INSTANCE} from '@azure/msal-angular';
// import { BrowserCacheLocation, InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';

//Angular Authentication 
import { AuthInterceptor } from './_authentication/auth.interceptor';
import { AuthGuard } from './_authentication/auth.guard';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';

//Angular FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

//Other libary packages
import { ToastrModule } from 'ngx-toastr';

//Service
import { CalendarService } from './_services/calendar.service';
import { UserService } from './_services/user.service';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])




const lang = 'en-US';





// export function MSALinstanceFactory(): IPublicClientApplication
// {
//   return new PublicClientApplication({
//     auth:
//     {
//       clientId: '45aeb46b-f1a4-4110-a6f0-255178752ed3',
//       authority: 'https://login.microsoftonline.com/f069fbab-b0f7-4e8c-a14c-d042ab513525',
//       redirectUri: 'http://localhost:4200',      
//     },
//     cache:
//     {
//       cacheLocation: 'localStorage',
//       storeAuthStateInCookie: false,
//     }
//   })
// }
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AuthComponent,
    LoginComponent,
    ApproveDashboardComponent,
    HomeComponent,
    ForbiddenComponent,
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatFormFieldModule,
    MatExpansionModule,



    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,

    



    ReactiveFormsModule,
    FullCalendarModule,
    NgbModule,

    ToastrModule.forRoot(),

    //NgxMaterialTimepickerModule
  //   MsalModule.forRoot( new PublicClientApplication({ // MSAL Configuration
  //     auth: {
  //       clientId: '45aeb46b-f1a4-4110-a6f0-255178752ed3',
  //       authority: 'https://login.microsoftonline.com/f069fbab-b0f7-4e8c-a14c-d042ab513525',
  //       redirectUri: 'http://localhost:4200', 
  //         postLogoutRedirectUri: "http://localhost:4200/",
  //         navigateToLoginRequestUrl: true
  //     },
  //     cache: {
  //         cacheLocation : BrowserCacheLocation.LocalStorage,
  //         storeAuthStateInCookie: true, // set to true for IE 11
  //     },
  //     system: {
  //         loggerOptions: {
  //             loggerCallback: () => {},
  //             piiLoggingEnabled: false
  //         }
  //     }
  // }), 
  //   {
  //       interactionType: InteractionType.Popup, // MSAL Guard Configuration
  //       authRequest: {
  //         scopes: ['user.read']
  //       },
  //       loginFailedRoute: "/login-failed" 
  //   }
  // , 
  //   {
  //       interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
  //       protectedResourceMap: new Map
  //       (
  //         [
  //           ['https://graph.microsoft.com/v1.0/me', ['user.read']]
  //         ]
  //       )
  //   }
  // ),


  ],

  providers: [

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserService,
    CalendarService
  ],
  bootstrap: [AppComponent],
  entryComponents: [AuthComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule { }
