import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UseTermsPageRoutingModule } from './use-terms-routing.module';

import { UseTermsPage } from './use-terms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UseTermsPageRoutingModule
  ],
  declarations: [UseTermsPage]
})
export class UseTermsPageModule {}
