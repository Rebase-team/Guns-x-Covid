import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { GunsCovidEvents, CovidApiService, GunsCovidResponses, HttpPolling, GpsAPI } from '../services/covid-api.service';
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
  statusRequest: boolean = false;
  average: any = {
    current: {
      msg: "~",
      color: ""
    },
    min: "~",
    max: "~"
  }

  gps: GpsAPI;
  uuidsvc: UuidSvc;
  httpPolling: HttpPolling;
  
  constructor(private alert: AlertService, private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private storage: Storage) { }

  ngOnInit() {
    this.uuidsvc = new UuidSvc(this.storage);
    this.gps = new GpsAPI(this.geolocation);
    this.httpPolling = new HttpPolling(this.OnAgglomerationData, this.OnUpdatedPosition, (err) => { }, 12000, this.storage, this.geolocation, this);
    this.checkGPSPermission();
    this.httpPolling.beginPolling();
    let event = new GunsCovidEvents();
    event.OnCrowdingTodayGaranhuns = (data) => {
      this.OnAgglomerationData(data, this);
    }
    this.uuidsvc.getUuid((uuid)=> {
      CovidApiService.crowdingTodayGaranhuns(event, uuid);
    }, this.storage);
  }

  OnAgglomerationData(data, referrer) {
    let dataJSON = JSON.parse(data.data);
    
    let msgStatusCrowding = (value)=>{
      let restValue = value - Math.trunc(value);
      if (restValue != 0.5){
        value = Math.round(value);
      }
      return{
        0: "S/ dados",
        1: "Baixa",
        1.5: "Baixa ~ Normal", 
        2: "Normal",
        2.5: "Normal ~ Alta",
        3: "Alta", 
        3.5: "Alta ~ Muito alta",
        4: "Muito alta"
      }[value]
    }
  
    let colorStatusCrowding = (value)=>{
      let restValue = value - Math.trunc(value);
      if (restValue != 0.5){
        value = Math.round(value);
      }
      return{
        0: "dark",
        1.0: "levelGreen",
        1.5: "levelGreen", 
        2: "levelBlue",
        2.5: "levelBlue",
        3: "levelYellow", 
        3.5: "levelYellow",
        4: "levelRed"
      }[value]
    }
    switch(dataJSON.response){
      case GunsCovidResponses.CASES_TODAY_GARANHUNS.AVERAGE_MAX_AND_MIN_AGLOMERATION_SUCCESS:
        console.log(referrer)
        let NumOfVotes = Number(dataJSON.parameters.NumberOfVotes);
        let TotalVote = Number(dataJSON.parameters.TotalVote);
        let Measure = NumOfVotes != 0 ? TotalVote / NumOfVotes : 0;

        let msg = msgStatusCrowding(Measure);
        let color = colorStatusCrowding(Measure);
        referrer.average = {
          current: {
            msg: msg,
            color: color
          },
          min: dataJSON.parameters.BiggerAgglomeration.Start + " às " + dataJSON.parameters.BiggerAgglomeration.End,
          max: dataJSON.parameters.SmallerAgglomeration.Start + " às " + dataJSON.parameters.SmallerAgglomeration.End
        }
        break;
      case GunsCovidResponses.CASES_TODAY_GARANHUNS.UUID_FAILED:
        break;
      case GunsCovidResponses.CASES_TODAY_GARANHUNS.UUID_INVALID:
        break;
    }
    console.log(dataJSON);
  }

  OnUpdatedPosition(data) {
    console.log(data);
  }

  //Checa permissão do GPS
  private checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
        if (result.hasPermission) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then().catch(reason => {
            this.alert.activeAlert('Falha ao obter localização', 'Você precisa ativar a localização e permitir que possamos utilizá-la.').then(() => { });
          })
        } else {
          this.requestGPSPermission();
        }
      }).catch((error) => {
        this.alert.activeAlert("Problema com o cordova", "Erro ao acessar plugin.");
      });
  }

  //Solicita permissão do GPS
  private requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (!canRequest) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(this.checkGPSPermission);
      }
    });
  }

  //Enviar voto
  submitVote() {
    this.statusRequest = true;
    this.gps.ReadDevicePosition((pos) => {
      let isInCity: boolean = geolib.isPointWithinRadius({ latitude: -8.891052, longitude: -36.494519 }, { latitude: pos.lat, longitude: pos.long }, 5000);
      if (isInCity) {
        let event = new GunsCovidEvents();
        event.OnSubmiteVote = (data) => {
          this.statusRequest = false;
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
              this.alert.activeAlert("Tente responder novamente", "Falha no UUID.");
              break;
            case GunsCovidResponses.SUBMIT_VOTE.UUID_INVALID:
              this.alert.activeAlert("Tente responder novamente", "UUID inválido.");
              break;
            case GunsCovidResponses.SUBMIT_VOTE.VOTE_INVALID:
              this.alert.activeAlert("Tente responder novamente", "Voto inválido.");
              break;
            default:
              this.alert.activeAlert("Tente responder novamente", "Problema inesperado.");
          }
        }
        event.OnErrorTriggered = (error) => {
          this.statusRequest = false;
          console.log(error);
        }
        this.storage.get("uuid").then((uuid) => {
          CovidApiService.submitVote(event, uuid, this.vote);
        });
      }
      else {
        this.statusRequest = false;
        this.alert.activeAlert("Longe do centro", "Você precisa está em um raio de 5 km para poder responder.");
      }
    });
  }
}