import { PopupTemplateComponent } from "../components/popup/popup-template/popup-template.component";

export default class Utils 
{
    //static baseUrl: string = 'http://localhost:8000/api';

    static baseUrl: string = 'http://api.timechoice.solutions/api';

    // static baseUrl: string = 'http://52.221.252.133:8000/api';

    static AUTH_API : string = Utils.baseUrl + '/auth';
    static SCHEDULE_API : string = Utils.baseUrl + '/schedule';
    static EVENT_API : string = Utils.baseUrl + '/event';
    static NOTIFY_API : string = Utils.baseUrl + '/notify';
    static ACCOUNT_API : string = Utils.baseUrl + '/account';
    static PUBLIC_API : string = Utils.baseUrl + '/public/schedule';
    static ADMIN_API: string = Utils.baseUrl + '/admin';

    static CALLBACK_AUTH_BOOK: string = 'http://localhost:4200/authorize/oauth2/user/callback';
    static CALLBACK_AUTH_SYNC: string = 'http://localhost:4200/authorize/oauth2/user/callback';

    //Confirm Asking Messages
    static confirmSyncGoogle: string = 'Are you sure want to sync your calendar with Google Calendar?';
    static confirmShare: string = 'Are you sure want to share your calendar with this partner?';
    static confirmBook: string = 'Are you sure want to book with this partner?';

    //Other Messages
    static syncSuccessMessage: string = 'Your calendar is now synced successfully with the Google Calendar.'
    static syncErrorDefaultMessage: string = 'There is a problem. Your calendar is not sync with Google Calendar.'
    static syncErrorSameCodeMessage: string = 'There is a problem. Please click on sync button again.'
        
    static authSuccessMessage: string = 'Account is being authorized';

    //Error Messages

    //Status Code
    static status200: string = '200 SUCCESS';
    static status400: string = '400 ERROR';
    static status401: string = '401 UNAUTHORIZED';
    static status403: string = '403 PERMISSION';
    static status404: string = '404 PAGE NOT FOUND';
}