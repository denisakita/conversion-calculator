import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CurrencyConverterComponent} from './currency-converter.component';
import {CurrencyService} from '../../services';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {SharedModule} from "../../../shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const currencyService = jasmine.createSpyObj('CurrencyService', ['getAvailableCurrencies', 'getExchangeRate']);
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    const router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      imports: [ReactiveFormsModule, SharedModule, BrowserAnimationsModule],
      providers: [
        {provide: CurrencyService, useValue: currencyService},
        {provide: MatSnackBar, useValue: snackBar},
        {provide: Router, useValue: router}
      ]
    }).compileComponents();

    currencyServiceSpy = TestBed.inject(CurrencyService) as jasmine.SpyObj<CurrencyService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    expect(component.currencyForm.get('amount')).toBeTruthy();
    expect(component.currencyForm.get('fromCurrency')).toBeTruthy();
    expect(component.currencyForm.get('toCurrency')).toBeTruthy();
  });

  it('should fetch available currencies on init', () => {
    const mockCurrencies = ['USD', 'EUR', 'GBP'];
    currencyServiceSpy.getAvailableCurrencies.and.returnValue(of(mockCurrencies));

    component.ngOnInit();

    expect(currencyServiceSpy.getAvailableCurrencies).toHaveBeenCalled();
    expect(component.currencies).toEqual(mockCurrencies);
  });

  it('should convert currency correctly', fakeAsync(() => {
    const amount = 100;
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    const mockExchangeRate = {exchange_rates: {EUR: 0.85}};
    currencyServiceSpy.getExchangeRate.and.returnValue(of(mockExchangeRate));

    component.currencyForm.setValue({amount, fromCurrency, toCurrency});
    component.convert();
    tick();

    expect(component.result).toEqual('€85.00');
    expect(component.historicalRates.length).toBe(1);
    expect(component.historicalRates[0]).toEqual({from: fromCurrency, to: toCurrency, rate: 0.85});
  }));

  it('should handle conversion error', fakeAsync(() => {
    currencyServiceSpy.getExchangeRate.and.returnValue(throwError('Error'));

    component.convert();
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Invalid data format or missing exchange rate information', 'Close', {duration: 5000});
  }));

  it('should display error snack bar when fetching available currencies fails', fakeAsync(() => {
    currencyServiceSpy.getAvailableCurrencies.and.returnValue(throwError('Error'));

    component.ngOnInit();
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Error fetching available currencies: Error', 'Close', {duration: 5000});
  }));

  it('should handle form validation error', () => {
    component.currencyForm.setValue({amount: null, fromCurrency: null, toCurrency: null});
    component.convert();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Please fill all the fields with valid values', 'Close', {duration: 5000});
  });

  it('should redirect to length converter page', () => {
    component.redirectToLengthConverter();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/length-converter');
  });

  it('should swap units', () => {
    component.currencyForm.setValue({fromCurrency: 'USD', toCurrency: 'EUR'});

    component.swapUnits();

    expect(component.currencyForm.get('fromCurrency')?.value).toEqual('EUR');
    expect(component.currencyForm.get('toCurrency')?.value).toEqual('USD');
  });

  it('should format result correctly', () => {
    const originalAmount = 100;
    const convertedAmount = 85;

    expect(component.formatResult(originalAmount, 'USD', convertedAmount, 'EUR')).toEqual('€85.00');
    expect(component.formatResult(originalAmount, 'USD', convertedAmount, 'GBP')).toEqual('85.00 GBP');
    expect(component.formatResult(originalAmount, 'USD', convertedAmount, 'CAD')).toEqual('85.00 CAD');
  });
});
