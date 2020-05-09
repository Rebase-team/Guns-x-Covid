import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeakTimes } from './peak-times.page';

const routes: Routes = [
  {
    path: '',
    component: PeakTimes,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeakTimesRoutingModule {}
