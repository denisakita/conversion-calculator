import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ConverterRoutingModule} from "./converter-routing.module";
import {CurrencyConverterComponent} from "./components/currency-converter/currency-converter.component";
import {LengthConverterComponent} from "./components/length-converter/length-converter.component";

@NgModule({
  declarations: [
    CurrencyConverterComponent,
    LengthConverterComponent
  ],
  imports: [
    BrowserModule,
    ConverterRoutingModule
  ],
})
export class ConverterModule {
}
