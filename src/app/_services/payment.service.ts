import { Injectable } from '@angular/core';
import Utils from '../_utils/utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  async getApprovalUrl(username: string) {
    debugger;
    let requestBody = {
      username: username,
    };
    try {
      const requestUrl = `${Utils.PAYMENT_API}/get-approve-url`;
      const response: any = await lastValueFrom(
        this.http.post(requestUrl, requestBody)
      );
      debugger;
      return response.data;
    } catch (error) {
      debugger;
      return 'get payment url error';
    }
  }

  executePayment(requestBody: any): Observable<any> {
    return this.http
      .post(`${Utils.PAYMENT_API}/execute-payment`, requestBody)
      .pipe(
        map((response: any) => {
          if (response.statusCode == 200) {
            return response;
          }
        }),
        catchError((err) => {
          debugger;
          return 'execute payment error';
        })
      );
  }
}
