import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  subscribeBackButton: any;
  
  constructor(private platform: Platform) {}

  ionViewWillEnter() {
    this.subscribeBackButton = this.platform.backButton.subscribeWithPriority(0, () => {
      navigator["app"].exitApp();
    });
  }

  ionViewWillLeave(){
    this.subscribeBackButton.unsubscribe();
    this.subscribeBackButton = null;
  }
}
