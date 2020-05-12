import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private alert: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.logicCloseApp();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#f4f5f8');
      this.router.navigateByUrl('welcome');
      this.splashScreen.hide();
    });
  }

  logicCloseApp(){
    this.platform.backButton.subscribeWithPriority(-1, async() => {
      const alert = await this.alert.create({
        header: "Sair do App",
        message: "Você deseja sair do App?",
        buttons: [
          {
            text:"Agora não"
          },
          {
            text: "Sim",
            handler: (() => {
              navigator['app'].exitApp();
            })
          }
        ]
      });
      alert.present();
    });
  }
}
