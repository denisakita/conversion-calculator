import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'currency-converter', pathMatch: 'full'},
  {
    path: '',
    loadChildren: () => import('./converter/converter.module').then(m => m.ConverterModule),
  },

  {path: '**', redirectTo: 'currency-converter', pathMatch: 'full'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
