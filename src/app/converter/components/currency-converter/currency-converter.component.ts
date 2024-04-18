import {Component, OnInit} from '@angular/core';
import {CurrencyService} from "../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.css'
})
export class CurrencyConverterComponent implements OnInit {
  result: string = '';
  currencyForm: FormGroup = new FormGroup({});
  currencies: string[] = [];
  historicalRates: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private currencyService: CurrencyService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.currencyForm = this.formBuilder.group({
      amount: [1, Validators.required],
      fromCurrency: ['', Validators.required],
      toCurrency: ['', Validators.required]
    });

    this.getCurrenciesList();
    // this.fetchHistoricalRates();
  }


  getCurrenciesList() {
    this.currencyService.getAvailableCurrencies().subscribe(
      (data: string[]) => {
        this.currencies = data;
      },
      (error: any) => {
        this.openSnackBar('Error fetching available currencies: ' + error, 'Close');

      }
    );
  }

  convert() {
    if (this.currencyForm.invalid || !this.currencyForm.get('amount') ||
      !this.currencyForm.get('fromCurrency') || !this.currencyForm.get('toCurrency')) {
      return;
    }

    const amount = this.currencyForm.get('amount')?.value;
    const fromCurrency = this.currencyForm.get('fromCurrency')?.value;
    const toCurrency = this.currencyForm.get('toCurrency')?.value;

    if (!fromCurrency || !toCurrency) {
      return;
    }

    this.currencyService.getExchangeRate(fromCurrency, toCurrency).subscribe(
      (data: any) => {
        if (data && data.exchange_rates && data.exchange_rates[toCurrency]) {
          const rate = data.exchange_rates[toCurrency];
          const convertedAmount = amount * rate;
          // this.result = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
          this.result = this.formatResult(amount, fromCurrency, convertedAmount, toCurrency);
          this.historicalRates.push({from: fromCurrency, to: toCurrency, rate: rate});

        } else {
          this.openSnackBar('Invalid data format or missing exchange rate information', 'Close');
        }
      },
      (error: any) => {
        this.openSnackBar('Invalid data format or missing exchange rate information', 'Close');
      }
    );
  }

  formatResult(originalAmount: number, fromCurrency: string, convertedAmount: number, toCurrency: string): string {
    switch (toCurrency) {
      case 'USD':
        return `$${convertedAmount.toFixed(2)}`;
      case 'EUR':
        return `€${convertedAmount.toFixed(2)}`;
      case 'GBP':
        return `£${convertedAmount.toFixed(2)}`;
      default:
        return `${convertedAmount.toFixed(2)} ${toCurrency}`;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }


  redirectToLengthConverter() {
    this.router.navigateByUrl('/length-converter');
  }

  // API_HISTORICAL has a problem with to many requests

  // fetchHistoricalRates() {
  //   this.currencyService.getHistoricalRates().subscribe(
  //     (data: any) => {
  //       this.historicalRates = data;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching historical rates:', error);
  //     }
  //   );
  // }
}
