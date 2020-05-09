import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeakTimes } from './peak-times.page';

import { PeakTimesRoutingModule } from './peak-times-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PeakTimesRoutingModule
  ],
  declarations: [PeakTimes]
})
export class PeakTimesPageModule {}
