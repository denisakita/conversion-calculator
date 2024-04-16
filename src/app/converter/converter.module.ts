import {NgModule} from '@angular/core';
import {ConverterRoutingModule} from "./converter-routing.module";
import * as fromComponents from "./components";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {FlexModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    ...fromComponents.components,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FlexModule,
    ConverterRoutingModule
  ],
})
export class ConverterModule {
}
