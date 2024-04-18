import {HttpClient} from "@angular/common/http";
import {CurrencyService} from "./currency.service";
import {of} from "rxjs";

describe('CurrencyService', () => {
  let httpClientMock: jasmine.SpyObj<HttpClient>;
  let service: CurrencyService;

  beforeEach(() => {
    httpClientMock = jasmine.createSpyObj('HttpClient', ['get']);
    service = new CurrencyService(httpClientMock);
  });

  it('should return exchange rate for valid currencies', (done) => {
    const baseCurrency = 'USD';
    const targetCurrency = 'EUR';
    const mockResponse = {base: baseCurrency, rates: {[targetCurrency]: 0.9}};
    httpClientMock.get.and.returnValue(of(mockResponse));

    service.getExchangeRate(baseCurrency, targetCurrency)
      .subscribe(response => {
        expect(response.base).toEqual(baseCurrency);
        expect(response.rates[targetCurrency]).toEqual(0.9);
        done();
      });
  });


  it('should return available currencies from response', (done) => {
    const url = `${service.API_URL}?api_key=${service.API_KEY}&base=USD`;
    const mockResponse = {exchange_rates: {EUR: 0.9, GBP: 0.8}};
    httpClientMock.get.and.returnValue(of(mockResponse));

    service.getAvailableCurrencies()
      .subscribe(currencies => {
        expect(currencies).toEqual(['EUR', 'GBP']);
        done();
      });
  });
  it('should return available currencies from response', (done) => {
    const url = `${service.API_URL}?api_key=${service.API_KEY}&base=USD`;
    const mockResponse = {exchange_rates: {EUR: 0.9, GBP: 0.8}};
    httpClientMock.get.and.returnValue(of(mockResponse));

    service.getAvailableCurrencies()
      .subscribe(currencies => {
        expect(currencies).toEqual(['EUR', 'GBP']);
        done();
      });
  });


});
