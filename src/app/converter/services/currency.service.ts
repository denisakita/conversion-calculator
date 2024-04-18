import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {catchError, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private API_KEY = `${environment.API_KEY}`;
  private API_URL = `${environment.API_URL}`;
  private API_HISTORICAL = `${environment.API_HISTORICAL}`;


  constructor(private http: HttpClient) {
  }

  getExchangeRate(baseCurrency: string, targetCurrency: string): Observable<any> {
    const apiUrl = `${this.API_URL}/?api_key=${this.API_KEY}&base=${baseCurrency}&target=${targetCurrency}`;
    return this.http.get(apiUrl);

  }

  getAvailableCurrencies(): Observable<string[]> {
    const url = `${this.API_URL}?api_key=${this.API_KEY}&base=USD`;
    return this.http.get<any>(url)
      .pipe(
        map(response => Object.keys(response.exchange_rates)),
        catchError(error => {
          console.error('Error fetching available currencies:', error);
          return [];
        })
      );
  }

  // getHistoricalRates(): Observable<any> {
  //   const params = new HttpParams().set('api_key', this.API_KEY);
  //   return this.http.get<any>(this.API_HISTORICAL, { params }).pipe(
  //     catchError(error => {
  //       console.error('Error fetching historical rates:', error);
  //       throw error;
  //     })
  //   );
  // }

}
