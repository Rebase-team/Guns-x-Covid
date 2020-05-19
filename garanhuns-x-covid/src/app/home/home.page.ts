import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { GunsCovidEvents, CovidApiService, GunsCovidResponses, HttpPolling, GpsAPI } from '../services/covid-api.service';
import { InfoCrowdingService } from '../services/info-crowding.service';
import { Storage } from "@ionic/storage";
import { AlertService } from '../services/alert.service';
import { UuidSvc } from '../UuidStorage';

const geolib = require('geolib');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {
  vote: string = "";
  average: any = {
    current: {
      msg: "~",
      color: ""
    },
    min: "~",
    max: "~"
  };

  gps: GpsAPI;

  disabledAnswer: boolean = false;

  httpPolling: HttpPolling;
  constructor(private alert: AlertService, private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private storage: Storage, private uuidsvc: UuidSvc) { }

  ngOnInit() {
    this.gps = new GpsAPI(this.geolocation);
    this.httpPolling = new HttpPolling(this.OnAgglomerationData, this.OnUpdatedPosition, (err) => { }, 5000, this.storage, this.geolocation);
    this.checkGPSPermission();
    this.httpPolling.beginPolling();
  }

  OnAgglomerationData(data) {
    console.log(data);
  }

  OnUpdatedPosition(data) {
    console.log(data);
  }

  //Checa permissão do GPS
  private checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then().catch(reason => {
            this.alert.activeAlert('Falha ao obter localização', 'Você precisa ativar a localização e permitir que possamos utilizá-la.').then(() => { });
          })
        } else {
          this.requestGPSPermission();
        }
      },
      (error) => {
        this.alert.activeAlert("Problema com o cordova", "Erro ao acessar plugin.");
      }
    );
  }

  //Solicita permissão do GPS
  private requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (!canRequest) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(this.askToTurnOnGPS);
      }
    });
  }

  //Enviar voto
  submitVote() {
    this.gps.ReadDevicePosition((pos) => {
      let isInCity: boolean = geolib.isPointWithinRadius({ latitude: -8.891052, longitude: -36.494519 }, { latitude: pos.lat, longitude: pos.long }, 5000);
      if (isInCity) {
        this.disabledAnswer = true;
        let event = new GunsCovidEvents();
        event.OnSubmiteVote = (data) => {
          let dataJSON = JSON.parse(data.data);
          switch (dataJSON.response) {
            case GunsCovidResponses.SUBMIT_VOTE.VOTE_SUBMITED:
              this.alert.activeAlert("Obrigado", "Continue interagindo com o App sempre que possível para contribuir com o bem-estar da cidade.<br><strong>Daqui a uma hora você pode informar novamente como anda a movimentação no centro.</strong>");
              break;
            case GunsCovidResponses.SUBMIT_VOTE.ERROR_WHEN_VOTING:
              this.alert.activeAlert("Erro ao responder", "Tente responder novamente.");
              break;
            case GunsCovidResponses.SUBMIT_VOTE.TOO_MANY_VOTES:
              this.alert.activeAlert("Você já respondeu", "Daqui uma hora a partir da última vez que você respondeu você pode responder novamente.");
              break;
            case GunsCovidResponses.SUBMIT_VOTE.UUID_FAILED:
              this.disabledAnswer = false;
              break;
            case GunsCovidResponses.SUBMIT_VOTE.UUID_INVALID:
              this.disabledAnswer = false;
              break;
            case GunsCovidResponses.SUBMIT_VOTE.VOTE_INVALID:
              this.disabledAnswer = false;
              break;
            default:
              this.disabledAnswer = false;
          }
        }
        event.OnErrorTriggered = (error) => {
          this.disabledAnswer = false;
          console.log(error);
        }
        this.storage.get("uuid").then((uuid) => {
          CovidApiService.submitVote(event, uuid, this.vote);
        });
      }
      else {
        this.alert.activeAlert("Longe do centro", "Você precisa está em um raio de 5 km para poder responder.");
      }
    });
  }
}