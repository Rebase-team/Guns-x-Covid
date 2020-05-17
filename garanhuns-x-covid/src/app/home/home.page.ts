import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Subject, NEVER, interval } from 'rxjs';
import { switchMap, materialize, dematerialize } from 'rxjs/operators';
import { GunsCovidEvents, CovidApiService, GunsCovidResponses } from '../services/covid-api.service';
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
  source: any = interval(5000);
  pauser = new Subject();
  disabledAnswer: boolean = false;
  dataNotCollected: boolean = true;

  constructor(private alert: AlertService,
              private androidPermissions: AndroidPermissions,
              private locationAccuracy: LocationAccuracy,
              private geolocation: Geolocation,
              private covidApi: CovidApiService,
              private storage: Storage,
              private infoCrowding: InfoCrowdingService) {
  }

  ionViewWillEnter() {
    this.showCasesTodayGuns();
    this.pauser
      .pipe(
        switchMap(paused => paused ? NEVER : this.source.pipe(materialize())),
        dematerialize()
      )
      .subscribe(() => {
        this.showCasesTodayGuns();
      });
    this.pauser.next(false);
  }

  ionViewDidLeave() {
    //Pausa a função showCasesTodayGuns()
    this.pauser.next(true);
  }

  //Balanço de aglomeração no dia
  private showCasesTodayGuns(){
    let event = new GunsCovidEvents();
    event.OnCasesTodayGaranhuns = (data) => {
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
          console.log("UUID falhou.");
          break;
        case GunsCovidResponses.CASES_TODAY_GARANHUNS.UUID_INVALID:
          console.log("UUID inválido.");
          break;
        default:
          console.log("Algo inesperado ocorreu");
      }
    }
    event.OnErrorTriggered = (error) => {
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      this.covidApi.casesTodayGaranhuns(event,uuid);
    });
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
        this.alert.activeAlert("Problema com o cordova", "Erro ao acessar plugin.");
      }
    );
  }

  //Solicita permissão do GPS
  private requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        //Já permitiu
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
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
        this.submitVote();
      }
      else {
        this.alert.activeAlert("Longe do centro", "Você precisa está em um raio de 5 km para poder responder.");
      }
    }).catch(() => {
      this.disabledAnswer = false;
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
          this.alert.activeAlert("Erro ao responder", "Tente responder novamente.");
          break;
        case GunsCovidResponses.SUBMIT_VOTE.TOO_MANY_VOTES:
          this.alert.activeAlert("Você já respondeu", "Daqui uma hora a partir da última vez que você respondeu você pode responder novamente.");
          break;
        case GunsCovidResponses.SUBMIT_VOTE.UUID_FAILED:
          this.disabledAnswer = false;
          console.log("UUID falhou.");
          break;
        case GunsCovidResponses.SUBMIT_VOTE.UUID_INVALID:
          this.disabledAnswer = false;
          console.log("UUID inválido.");
          break;
        case GunsCovidResponses.SUBMIT_VOTE.VOTE_INVALID:
          this.disabledAnswer = false;
          console.log("Voto inválido.");
          break;
        default:
          this.disabledAnswer = false;
          console.log("Erro inesperado.");
      }
    }
    event.OnErrorTriggered = (error) => {
      this.disabledAnswer = false;
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      this.covidApi.submitVote(event, uuid, this.vote);
    })
  }
}
