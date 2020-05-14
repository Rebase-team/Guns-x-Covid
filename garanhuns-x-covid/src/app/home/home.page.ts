import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Device } from "@ionic-native/device/ngx";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";

const geolib = require('geolib');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit{
  disabledAnswer: boolean = false;
  uuid = this.device.uuid;
  locationCoords: any;
  
  constructor(private alert: AlertController,
              private device: Device,
              private androidPermissions: AndroidPermissions,
              private locationAccuracy: LocationAccuracy,
              private geolocation: Geolocation) {
  }

  ngOnInit(){
    this.showInfoCrowding();
  }

  //Checa permissão do GPS
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.askToTurnOnGPS();
        } else {
          this.requestGPSPermission();
        }
      },
      (error) => {
        this.alertInfo("Problema com o cordova", "Erro ao acessar plugin.", "Entendi");
      }
    );
  }

  //Solicita permissão do GPS
  private requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.askToTurnOnGPS();
            },
            (error) => {
              this.alertInfo("Problema com a permissão", "Erro ao solicitar permissão de GPS.", "Entendi");
            }
          );
      }
    });
  }

  //Pede para ativar GPS
  private askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.getLocationCoordinates();
      },
      (error) => {
        this.alertInfo("Problema com a permissão", "Erro ao tentar pegar permissão de GPS.", "Entendi");
      }
    );
  }

  //Pega localização
  getLocationCoordinates() {
    this.disabledAnswer = true;
    this.geolocation.getCurrentPosition({timeout: 3000}).then((response) => {
      let isInCity: boolean = geolib.isPointWithinRadius(
        { latitude: -8.891052, longitude: -36.494519 },
        { latitude: response.coords.latitude, longitude: response.coords.longitude },
        5000);
        
      /*let preciseDistance = geolib.getPreciseDistance(
          { latitude: -8.891052, longitude: -36.494519 },
          { latitude: response.coords.latitude, longitude: response.coords.longitude },
      );  
      console.log(preciseDistance);*/
      // ^^^^^^
      //Calcula e mostra a distância entre os pontos.

      if (isInCity) {
        this.alertInfo("Obrigado", "Continue interagindo com o App sempre que possível " +
          "para contribuir com o bem-estar da cidade." +
          `<br><strong>Daqui a uma hora você pode informar novamente ` +
          `como anda a movimentação no centro.</strong>`, "Entendi");
      }
      else {
        this.disabledAnswer = false;
        this.alertInfo("Longe do centro", "Você precisa está em um raio de 5 km para poder responder.", "Entendi");
      }
    }).catch(() => {
      this.disabledAnswer = false;
      this.alertInfo('Erro na localização', "Ocorreu uma falha ao tentar pegar sua localização. Verifique sua conexão com à Internet.", "Entendi");
    });
  }

  //Alerta de status da pergunta
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

  //Alerta sobre a informação do envio da pergunta
  private showInfoCrowding(){
    //Chamar em tempo real função que pega dados sobre 
    //movimentação/aglomeração no dia.
  }
}
