import { Component, OnInit } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  subscribeBackButton: any;
  mutex: Boolean = false;
  mutexExit: Boolean = false;
  
  constructor(private platform: Platform, private navCtrl: NavController, private alert: AlertController) {}

  ngOnInit() {
    this.subscribeBackButton = this.platform.backButton.subscribeWithPriority(Number.MAX_SAFE_INTEGER - 1, () => {
      if (!this.mutex){
        let url = this.platform.url().toUpperCase();
        if ((url.indexOf('HOME') != -1) || (url.indexOf('SLIDE') != -1)){
          if (!this.mutexExit){
            this.alert.create({
              header: "Confirmação de saída do App",
              message: "Deseja sair do App?",
              buttons: [
                { text: "Agora não", handler: () => { this.mutexExit = false; } },
                {
                  text: 'Sim', handler: () => {
                    try {
                      navigator['app'].exitApp();
                    } catch (e) { }
                  }
                }
              ]
            }).then((alertExit) => { alertExit.present(); });
          }
          
        }
        else{
          this.navCtrl.back();
        }
        this.mutex = true;
        setTimeout(()=>{this.mutex = false;}, 100);
      }
    });
  }

}
