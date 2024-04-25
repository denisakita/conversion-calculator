import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule} from '@angular/router/testing';
import {of, throwError} from 'rxjs';
import {CurrencyService} from '../../services';
import {CurrencyConverterComponent} from './currency-converter.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../../shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Router} from "@angular/router";

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let currencyService: jasmine.SpyObj<CurrencyService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(async () => {
    const currencyServiceSpy = jasmine.createSpyObj('CurrencyService', ['getAvailableCurrencies', 'getExchangeRate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatIconModule,
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: CurrencyService, useValue: currencyServiceSpy},
        {provide: MatSnackBar, useValue: snackBarSpy}
      ]
    }).compileComponents();

    currencyService = TestBed.inject(CurrencyService) as jasmine.SpyObj<CurrencyService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;


    currencyService.getAvailableCurrencies.and.returnValue(of([]));
    currencyService.getExchangeRate.and.returnValue(of({}));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form validation errors on convert()', () => {
    const invalidFormValues = [
      {amount: null, fromCurrency: 'USD', toCurrency: 'EUR'},
      {amount: 100, fromCurrency: '', toCurrency: 'EUR'},
      {amount: 100, fromCurrency: 'USD', toCurrency: ''}
    ];

    invalidFormValues.forEach(invalidValue => {
      component.currencyForm.patchValue(invalidValue);
      component.convert();

      expect(snackBar.open).toHaveBeenCalledWith('Please fill all the fields with valid values', 'Close', jasmine.any(Object));
    });
  });


  it('should handle error while fetching currencies list', () => {
    currencyService.getAvailableCurrencies.and.returnValue(throwError('Error'));

    component.getCurrenciesList();

    expect(snackBar.open).toHaveBeenCalledWith('Error fetching available currencies: Error', 'Close', jasmine.any(Object));
  });

  it('should populate currencies list on successful getAvailableCurrencies call', () => {
    const availableCurrencies = ['USD', 'EUR', 'GBP'];
    currencyService.getAvailableCurrencies.and.returnValue(of(availableCurrencies));

    component.getCurrenciesList();
    fixture.detectChanges();

    expect(component.currencies).toEqual(availableCurrencies);
  });

  // Logic Tests

  it('should handle error while converting currencies', fakeAsync(() => {
    const amount = 100;
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    currencyService.getExchangeRate.and.returnValue(throwError('Error'));
    component.currencyForm.patchValue({amount, fromCurrency, toCurrency});

    component.convert();
    tick(5000);


    expect(snackBar.open).toHaveBeenCalledWith('Invalid data format or missing exchange rate information', 'Close', jasmine.any(Object));
  }));


  it('should show conversion result on successful getExchangeRate call', fakeAsync(() => {
    const amount = 100;
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    const exchangeRate = 0.85;
    const expectedResult = `€${(amount * exchangeRate).toFixed(2)}`;

    currencyService.getExchangeRate.and.returnValue(of({exchange_rates: {[toCurrency]: exchangeRate}}));

    component.currencyForm.patchValue({amount, fromCurrency, toCurrency});
    component.convert();
    tick(5000);

    expect(component.result).toEqual(expectedResult);
  }));

  it('should format the converted amount correctly based on the target currency', () => {
    const originalAmount = 100;
    const fromCurrency = 'USD';
    let convertedAmount: number;
    let formattedResult: string;

    // Test formatting for USD
    const toCurrencyUSD = 'USD';
    convertedAmount = 100;
    formattedResult = component.formatResult(originalAmount, fromCurrency, convertedAmount, toCurrencyUSD);
    expect(formattedResult).toEqual('$100.00');

    // Test formatting for EUR
    const toCurrencyEUR = 'EUR';
    convertedAmount = 85.5;
    formattedResult = component.formatResult(originalAmount, fromCurrency, convertedAmount, toCurrencyEUR);
    expect(formattedResult).toEqual('€85.50');

    // Test formatting for GBP
    const toCurrencyGBP = 'GBP';
    convertedAmount = 70;
    formattedResult = component.formatResult(originalAmount, fromCurrency, convertedAmount, toCurrencyGBP);
    expect(formattedResult).toEqual('£70.00');

    // Test formatting for other currencies
    const toCurrencyOther = 'CAD';
    convertedAmount = 125;
    formattedResult = component.formatResult(originalAmount, fromCurrency, convertedAmount, toCurrencyOther);
    expect(formattedResult).toEqual('125.00 CAD');
  });

  it('should navigate to the length converter page when redirectToLengthConverter is called', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.redirectToLengthConverter();
    expect(navigateSpy).toHaveBeenCalledWith('/length-converter');
  });

  it('should swap "from" and "to" currency units and call convert method when swapUnits is called', () => {

    component.currencyForm.patchValue({fromCurrency: 'USD', toCurrency: 'EUR'});

    spyOn(component, 'convert');

    component.swapUnits();

    expect(component.currencyForm.get('fromCurrency')?.value).toEqual('EUR');
    expect(component.currencyForm.get('toCurrency')?.value).toEqual('USD');

    expect(component.convert).toHaveBeenCalled();
  });

})
