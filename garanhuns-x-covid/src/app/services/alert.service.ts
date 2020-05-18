import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alert: AlertController) { }

  async activeAlert(title, msg){
    const alert = await this.alert.create({
      header: title,
      message: msg,
      buttons: ["Entendi"]
    });
    alert.present();
  }
}
