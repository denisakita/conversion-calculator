import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CurrencyConverterComponent, LengthConverterComponent} from "./components";
import {CommonModule} from "@angular/common";

const routes: Routes = [
  {path: 'currency-converter', component: CurrencyConverterComponent, pathMatch: 'full'},
  {path: 'length-converter', component: LengthConverterComponent},

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConverterRoutingModule {
}
