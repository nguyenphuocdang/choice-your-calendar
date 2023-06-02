import { PopupTemplateComponent } from '../components/popup/popup-template/popup-template.component';

export default class Utils {
  static baseUrl: string = 'https://api.timechoice.solutions:8000/api';
  static AUTH_API: string = Utils.baseUrl + '/auth';
  static SCHEDULE_API: string = Utils.baseUrl + '/schedule';
  static EVENT_API: string = Utils.baseUrl + '/event';
  static NOTIFY_API: string = Utils.baseUrl + '/notify';
  static ACCOUNT_API: string = Utils.baseUrl + '/account';
  static PUBLIC_API: string = Utils.baseUrl + '/public/schedule';
  static PUBLIC_EVENT_API: string = Utils.baseUrl + '/public/event';
  static ADMIN_API: string = Utils.baseUrl + '/admin';
  static PAYMENT_API: string = Utils.baseUrl + '/payment';
  static ORGANIZATION_API: string = Utils.baseUrl + '/organization';
  static DEVICE_API: string = Utils.baseUrl + '/organization/device';
  static SOCKET_API: string = Utils.baseUrl + '/send-message-to-socket';

  static CALLBACK_AUTH_BOOK: string =
    'https://timechoice.solutions/authorize/oauth2/user/callback';
  static CALLBACK_AUTH_SYNC: string =
    'https://timechoice.solutions/authorize/oauth2/user/callback';

  static signUpGoogleUrl: string = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email&access_type=online&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=https://timechoice.solutions/authorize/oauth2/user/callback&client_id=460639175107-rb3km6k5eac1aq9oihqcq1htkhvbqfif.apps.googleusercontent.com`;

  //Confirm Asking Messages
  static confirmSyncGoogle: string =
    'Are you sure want to sync your calendar with Google Calendar?';
  static confirmShare: string =
    'Are you sure want to share your calendar with this partner?';
  static confirmBook: string = 'Are you sure want to book with this partner?';

  //Other Messages
  static syncSuccessMessage: string =
    'Your calendar is now synced successfully with the Google Calendar.';
  static syncErrorDefaultMessage: string =
    'There is a problem. Your calendar is not sync with Google Calendar.';
  static syncErrorSameCodeMessage: string =
    'There is a problem. Please click on sync button again.';

  static authSuccessMessage: string = 'Account is being authorized';

  //Error Messages

  //Status Code
  static status200: string = '200 SUCCESS';
  static status400: string = '400 ERROR';
  static status401: string = '401 UNAUTHORIZED';
  static status403: string = '403 PERMISSION';
  static status404: string = '404 PAGE NOT FOUND';

  static convertUTCtoDateString(timestamp: any, dateOnly: boolean): string {
    // 1682295394786 => Monday, April 24, 2023(Date only)
    // 1682295394786 => Monday, April 24, 2023 at 7:16 AM
    const date = new Date(timestamp);
    const dateString = dateOnly
      ? date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
    return dateString;
  }

  static convertUTCtoDDMMYY(timestamp: any): string {
    // 1682295394786 => 24/03/2023
    const date = new Date(timestamp);
    const formatDay: string = Utils.convertFromDatetoDDMMYY(date);
    return formatDay;
  }

  static convertFromDatetoDDMMYY(date: Date): string {
    // Sat May 06 2023 00:00:00 => 06/05/2023
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayString = day < 10 ? `0${day}` : `${day}`;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const yearString = `${year}`;
    const formatDay = `${dayString}/${monthString}/${yearString}`;
    return formatDay;
  }

  static convertTimeTo24HoursFormat(time: string): string {
    //08:00 => 8 AM
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':');

    // Convert hours to number
    const hoursNum = Number(hours);

    // Determine if it's AM or PM
    const meridiem = hoursNum >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hoursNum % 12 || 12;

    // Construct the final time string in "X AM/PM" format
    const time12HourFormat = `${hours12} ${meridiem}`;

    return time12HourFormat;
  }

  static convertUTCtoTimeString(timestamp: any): string {
    // 1682295394786 => 7:16 AM
    const date = new Date(timestamp);
    const format = new Date(date.getTime() - 7 * 60 * 60 * 1000);
    const timeString = format.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    return timeString;
  }

  static convertYYYYMMDDtoDateString(timeString: string) {
    //'2023-05-25' => 'Thursday, May 25, 2023
    const date = new Date(timeString);
    const convertedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return convertedDate;
  }
  static toastrConfig = {
    timeOut: 1500, // Time duration in milliseconds for how long the toastr will be displayed
    extendedTimeOut: 1000, // Time duration in milliseconds for how long the toastr will be displayed after mouse hover
  };
}
