import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from "./shared/components/error-page/error-page.component";

const routes: Routes = [
  {path: '', redirectTo: 'currency-converter', pathMatch: 'full'},
  {
    path: '',
    loadChildren: () => import('./converter/converter.module').then(m => m.ConverterModule),
  },
  {path: 'error-page', component: ErrorPageComponent},

  {path: '**', redirectTo: 'currency-converter', pathMatch: 'full'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
