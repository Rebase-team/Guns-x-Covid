import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

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
    private navigation: NavController,
    private storage: Storage) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.get("firstAccess").then((value) => {
        if (value == null || value == undefined) {
          this.navigation.navigateRoot("slide");
        }
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#f4f5f8');
        this.splashScreen.hide();
      });
    });
  }
}
