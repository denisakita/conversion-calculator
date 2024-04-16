import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private API_URL = `${environment.API_HOST}`;
  private API_KEY = `${environment.API_KEY}`;

  constructor(private http: HttpClient) {
  }

  getExchangeRate(baseCurrency: string, targetCurrency: string): Observable<any> {
    const apiUrl = `${this.API_URL}v1/live/?api_key=${this.API_KEY}&base=${baseCurrency}&target=${targetCurrency}`;
    return this.http.get(apiUrl);
  }

  getAvailableCurrencies(): Observable<string[]> {
    return new Observable<string[]>(observer => {
      observer.next(['USD', 'EUR', 'GBP']);
      observer.complete();
    });
  }
}
