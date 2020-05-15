import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CovidPageRoutingModule } from './covid-routing.module';

import { CovidPage } from './covid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CovidPageRoutingModule
  ],
  declarations: [CovidPage]
})
export class CovidPageModule {}
