import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { GunsCovidEvents, CovidApiService, GunsCovidResponses, HttpPolling } from '../services/covid-api.service';
import { InfoCrowdingService } from '../services/info-crowding.service';
import { Storage } from "@ionic/storage";
import { AlertService } from '../services/alert.service';

const geolib = require('geolib');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage{
  vote: string = "";
  average: Object = {
    current: {
      msg: "~",
      color: ""
    },
    min: "~",
    max: "~"
  };
  coords: any = {};
  disabledAnswer: boolean = false;
  dataNotCollected: boolean = true;

  httpPolling: HttpPolling;
 
  constructor(private alert: AlertService, private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private storage: Storage, private infoCrowding: InfoCrowdingService) {}

  ngOnInit(){
    //Implemente o HTTP polling (dúvidas, falar com Muryllo).

    //this.httpPolling = new HttpPolling(function(data){
    //  console.log('success when trying to gather some information from the server')
    //}, function(data){
    //  console.log('success when trying to update the location of this device')
    //}, function(err){
    //  console.log('error triggered here.')
    //}, 5000, this.storage, this.geolocation);
    //this.httpPolling.beginPolling();
  }

  //Balanço de aglomeração no dia
  private showCrowdingTodayGuns(){
    let event = new GunsCovidEvents();
    event.OnCrowdingTodayGaranhuns = (data) => {
      let dataJSON = JSON.parse(data.data);
      switch (dataJSON.response) {
        case GunsCovidResponses.CASES_TODAY_GARANHUNS.AVERAGE_MAX_AND_MIN_AGLOMERATION_SUCCESS:
          this.average = {
            current: {
              msg: this.infoCrowding.msgStatusCrowding(dataJSON.parameters.Average),
              color: this.infoCrowding.colorStatusCrowding(dataJSON.parameters.Average)
            },
            min: dataJSON.parameters.SmallerAgglomeration.Start + " às " +
              dataJSON.parameters.SmallerAgglomeration.End,
            max: dataJSON.parameters.BiggerAgglomeration.Start + " às " +
              dataJSON.parameters.BiggerAgglomeration.End
          };
          if (Object(Object.values(dataJSON).includes(0))) {
            this.dataNotCollected = false;
          }
          else{
            this.dataNotCollected = true;
          }
          break;
        case GunsCovidResponses.CASES_TODAY_GARANHUNS.UUID_FAILED:
          ////
          break;
        case GunsCovidResponses.CASES_TODAY_GARANHUNS.UUID_INVALID:
          ////
          break;
        default:
          ////
      }
    }
    event.OnErrorTriggered = (error) => {
      ////
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      CovidApiService.crowdingTodayGaranhuns(event,uuid);
    });
  }

  //Checa permissão do GPS
  btnCheckGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.askToTurnOnGPS();
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
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
            () => {
              this.askToTurnOnGPS();
            },
            (error) => {
              this.alert.activeAlert("Problema com a permissão", "Erro ao solicitar permissão de GPS.");
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
        this.alert.activeAlert("Problema com a permissão", "Erro ao tentar pegar permissão de GPS.");
      }
    );
  }

  //Pega localização
  private getLocationCoordinates() {
    this.geolocation.getCurrentPosition({ timeout: 3000 }).then((response) => {
      this.coords = { latitude: response.coords.latitude, longitude: response.coords.longitude };
      let isInCity: boolean = geolib.isPointWithinRadius(
        { latitude: -8.891052, longitude: -36.494519 }, //Coordenadas do centro de Garanhuns
        { latitude: response.coords.latitude, longitude: response.coords.longitude },
        5000);
      if (isInCity) {
        this.submitVote();
      }
      else {
        this.alert.activeAlert("Longe do centro", "Você precisa está em um raio de 5 km para poder responder.");
      }
    }).catch(() => {
      this.disabledAnswer = false;
      ////
      this.alert.activeAlert('Tente novamente', "Ocorreu uma falha ao tentar pegar sua localização. Verifique sua conexão com à Internet.");
    });
  }

  private submitVote(){
    this.disabledAnswer = true;
    let event = new GunsCovidEvents();
    event.OnSubmiteVote = (data) => {
      let dataJSON = JSON.parse(data.data);
      switch(dataJSON.response){
        case GunsCovidResponses.SUBMIT_VOTE.VOTE_SUBMITED:
          this.alert.activeAlert("Obrigado", "Continue interagindo com o App sempre que possível " +
                                 "para contribuir com o bem-estar da cidade." +
                                 `<br><strong>Daqui a uma hora você pode informar novamente ` +
                                 `como anda a movimentação no centro.</strong>`);
          break;
        case GunsCovidResponses.SUBMIT_VOTE.ERROR_WHEN_VOTING:
          ////
          this.alert.activeAlert("Erro ao responder", "Tente responder novamente.");
          break;
        case GunsCovidResponses.SUBMIT_VOTE.TOO_MANY_VOTES:
          ////
          this.alert.activeAlert("Você já respondeu", "Daqui uma hora a partir da última vez que você respondeu você pode responder novamente.");
          break;
        case GunsCovidResponses.SUBMIT_VOTE.UUID_FAILED:
          this.disabledAnswer = false;
          ////
          break;
        case GunsCovidResponses.SUBMIT_VOTE.UUID_INVALID:
          this.disabledAnswer = false;
          ////
          break;
        case GunsCovidResponses.SUBMIT_VOTE.VOTE_INVALID:
          this.disabledAnswer = false;
          ////
          break;
        default:
          this.disabledAnswer = false;
          ////
      }
    }
    event.OnErrorTriggered = (error) => {
      ////
      this.disabledAnswer = false;
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      CovidApiService.submitVote(event, uuid, this.vote);
    })
  }

}
