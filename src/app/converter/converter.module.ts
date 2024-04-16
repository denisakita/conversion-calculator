import {NgModule} from '@angular/core';
import {ConverterRoutingModule} from "./converter-routing.module";
import * as fromComponents from "./components";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {FlexModule} from "@angular/flex-layout";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ...fromComponents.components,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FlexModule,
    SharedModule,
    ConverterRoutingModule,
    ReactiveFormsModule
  ],
})
export class ConverterModule {
}
