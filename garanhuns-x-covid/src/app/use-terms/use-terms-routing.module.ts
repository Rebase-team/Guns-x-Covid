import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UseTermsPage } from './use-terms.page';

const routes: Routes = [
  {
    path: '',
    component: UseTermsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UseTermsPageRoutingModule {}
