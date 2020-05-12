import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
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
  date: Date = new Date();
  disabledAnswer: boolean = false;
  uuid = this.device.uuid;

  constructor(private storage: Storage,
              private alert: AlertController,
              private geolocation: Geolocation,
              private device: Device) {
  }

  ngOnInit(){
  }

  isGaranhuns(){
    let isInCity: boolean;
    this.geolocation.getCurrentPosition().then((resp) => {
      isInCity = geolib.isPointWithinRadius(
        { latitude: -8.9365336, longitude: -36.6418746}, //Centro de Garanhuns
        { latitude: resp.coords.latitude, longitude: resp.coords.longitude }, //Coordenadas do usuário
        7000 //7 km
      );
     }).catch((error) => {
       console.log('Erro na localização', error);
     });
    return isInCity;
  }

  btnAnswerQuestion() {
    this.disabledAnswer = true;
    if (this.isGaranhuns() == true){
      this.storage.get("allowedTimeToRespond").then((allowedTime) => {
        if (this.date.getDay() == 0) {
          this.alertInfo("Domingo", "O App só funciona de segunda à sábado.", "Entendi");
        }
        else if (this.date.getHours() < 6 && this.date.getHours() > 18) {
          this.alertInfo("Hora sem atividade", "O App só funciona das 06 da manhã às 18 da noite.", "Entendi");
        }
        else if ((this.isFirstAccess(allowedTime)) || (this.date.toLocaleString() > allowedTime)) {
          //É bom que horas permitidas venham do servidor
          let currentDate = new Date(this.date.toLocaleString());
          //Soma 1 hora a hora atual.
          currentDate.setHours(currentDate.getHours() + 1).toLocaleString();
          //Manda a hora somada pro local storage.
          this.storage.set("allowedTimeToRespond", currentDate);
          this.alertInfo("Obrigado", "Continue interagingo com o App sempre que possível " +
            "para contribuir com o bem-estar da cidade." +
            `<br><strong>Daqui a uma hora você pode informar novamente ` +
            `como anda a movimentação no centro.</strong>`, "Entendi")
        }
        else {
          this.alertInfo("Já respondeu", "Daqui a uma hora você pode responder novamente.", "Entendi");
        }
      });
    }
    else{
      this.alertInfo("Não está na cidade", "Você precisa está em um raio de 7 km para poder responder.", "Entendi");
    }
  }

  isFirstAccess(value) {
    return (value == null || value == undefined || value == "")
  }

  async alertInfo(title, message, buttonText) {
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
}
