import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from "@ionic-native/device/ngx";

const geolib = require('geolib');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{
  disabledAnswer: boolean = false;
  uuid = this.device.uuid;

  constructor(private alert: AlertController,
              private geolocation: Geolocation,
              private device: Device) {
  }

  ngOnInit(){
    this.showInfoCrowding();
  }

  btnAnswerQuestion() {
    this.disabledAnswer = true;
    this.geolocation.getCurrentPosition().then((response) => {
      let isInCity: boolean = geolib.isPointWithinRadius(
        { latitude: -8.9365336, longitude: -36.6418746 },
        { latitude: response.coords.latitude, longitude: response.coords.longitude },
        7000);
      if (isInCity) {
        this.alertInfo("Obrigado", "Continue interagingo com o App sempre que possível " +
          "para contribuir com o bem-estar da cidade." +
          `<br><strong>Daqui a uma hora você pode informar novamente ` +
          `como anda a movimentação no centro.</strong>`, "Entendi");
      }
      else {
        this.alertInfo("Longe do centro", "Você precisa está em um raio de 7 km para poder responder.", "Entendi");
      }
    }).catch(() => {
      this.disabledAnswer = false;
      this.alertInfo('Erro na localização', "Ocorreu uma falha ao tentar pegar sua localização. Verifique sua conexão com à Internet.", "Entendi");
    });
  }

  private async alertInfo(title, message, buttonText) {
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: [
        {
          text: buttonText
        }
      ]
    });
    alert.present();
  }

  private showInfoCrowding(){
    //Chamar em tempo real função que pega dados sobre 
    //movimentação/aglomeração no dia.
  }
}
