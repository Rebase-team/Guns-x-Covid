import { Injectable } from '@angular/core';
import { HTTP } from "@ionic-native/http/ngx"
import { UuidSvc } from '../UuidStorage';
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { HomePage } from '../home/home.page';

const __UNSECURE_DEBUG_MODE = true;

@Injectable({
  providedIn: 'root'
})
export class CovidApiService {

  public static SERVER_ADDR = "https://api-covid.fun/covid/";
  //public static SERVER_ADDR = "http://192.168.0.107:14400/covid/"

  public static registerUser(event: GunsCovidEvents, uuid) {
    this.PutHttpRequest(this.SERVER_ADDR + `uuid/${uuid}`, {}, {}, event.OnRegisterSuccess, event.OnErrorTriggered);
  }

  public static submitVote(event: GunsCovidEvents, uuid, vote) {
    this.PostHttpRequest(this.SERVER_ADDR + `submit/${uuid}/${vote}`, {}, {}, event.OnSubmiteVote, event.OnErrorTriggered);
  }

  public static averageDay(event: GunsCovidEvents, uuid, day) {
    this.GetHttpRequest(this.SERVER_ADDR + `average/${uuid}/${day}`, {}, {}, event.OnAverageDay, event.OnErrorTriggered);
  }

  public static crowdingTodayGaranhuns(event: GunsCovidEvents, uuid) {
    this.GetHttpRequest(this.SERVER_ADDR + `today/${uuid}/garanhuns`, {}, {}, event.OnCrowdingTodayGaranhuns, event.OnErrorTriggered);
  }

  public static updatePosition(event: GunsCovidEvents, uuid, lat, lng, is_tracking) {
    this.PutHttpRequest(this.SERVER_ADDR + `track/${uuid}/${lat}/${lng}/${is_tracking}`, {}, {}, event.OnUpdatePosition, event.OnErrorTriggered);
  }

  public static casesCovidGuns(event: GunsCovidEvents, uuid){
    this.GetHttpRequest(this.SERVER_ADDR + `report/${uuid}/state/pe/garanhuns`, {}, {}, event.OnCasesCovidGuns, event.OnErrorTriggered);
  }

  public static casesCovidPe(event: GunsCovidEvents, uuid){
    this.GetHttpRequest(this.SERVER_ADDR + `report/${uuid}/state/pe`, {}, {}, event.OnCasesCovidPe, event.OnErrorTriggered);
  }

  public static casesCovidAllStates(event: GunsCovidEvents, uuid){
    this.GetHttpRequest(this.SERVER_ADDR + `report/${uuid}/state/all`, {}, {}, event.OnCasesCovidAllStates, event.OnErrorTriggered);
  }

  public static casesCovidBrazil(event: GunsCovidEvents, uuid: string, date: string){
    this.GetHttpRequest(this.SERVER_ADDR + `report/${uuid}/brazil/${date}`, {}, {}, event.OnCasesCovidBrazil, event.OnErrorTriggered);
  }

  public static casesCovidOfficialSources(event: GunsCovidEvents, uuid: string){
    this.GetHttpRequest(this.SERVER_ADDR + `report/${uuid}/official`, {}, {}, event.OnCasesCovidOfficialSources, event.OnErrorTriggered);
  }

  public static GetHttpRequest(addr, parameters, headers, successCallback, errorCallback) {
    if (!__UNSECURE_DEBUG_MODE) {
      new HTTP().get(
        addr,
        parameters,
        headers
      ).then(data => {
        successCallback(data);
      }).catch(error => {
        errorCallback(error);
      });
    }
    else {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "text";
      xhr.open("GET", addr + (Object.keys(parameters).length > 0 ? '?' : '') + Object.keys(parameters).map(function (key) { return key + "=" + encodeURIComponent(parameters[key]) }).join("&"), true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          console.log("Data incoming:");
          console.log(this);
          successCallback({ "data": this.responseText });
        }
      }
      if (typeof headers != "undefined" || headers === null) {
        for (let prop in headers) {
          xhr.setRequestHeader(prop, headers[prop]);
        }
      }
      xhr.onerror = errorCallback;
      xhr.send(null);
    }
  }

  public static PostHttpRequest(addr, parameters, headers, successCallback, errorCallback) {
    if (!__UNSECURE_DEBUG_MODE) {
      if (typeof headers != "object" || headers === null) {
        headers = {};
      }
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      new HTTP().post(
        addr,
        parameters,
        headers
      ).then(data => {
        successCallback(data);
      }).catch(error => {
        errorCallback(error);
      });
    }
    else {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "text";
      xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          console.log("Data incoming:");
          console.log(this);
          successCallback({ "data": this.responseText });
        }
      }
      xhr.open("POST", addr, true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      if (typeof headers != "object" || headers === null) {
        headers = {};
      }
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      for (let prop in headers) {
        xhr.setRequestHeader(prop, headers[prop]);
      }
      xhr.onerror = errorCallback;
      xhr.send(Object.keys(parameters).map(function (key) { return key + "=" + encodeURIComponent(parameters[key]) }).join("&"));
    }
  }

  public static PutHttpRequest(addr, parameters, headers, successCallback, errorCallback) {
    if (!__UNSECURE_DEBUG_MODE) {
      if (typeof headers != "object" || headers === null) {
        headers = {};
      }
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      new HTTP().put(
        addr,
        parameters,
        headers
      ).then(data => {
        successCallback(data);
      }).catch(error => {
        errorCallback(error);
      });
    }
    else {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "text";
      xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          console.log("Data incoming:");
          console.log(this);
          successCallback({ "data": this.responseText });
        }
      }
      xhr.open("PUT", addr, true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      if (typeof headers != "object" || headers === null) {
        headers = {};
      }
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      for (let prop in headers) {
        xhr.setRequestHeader(prop, headers[prop]);
      }
      xhr.onerror = errorCallback;
      xhr.send(Object.keys(parameters).map(function (key) { return key + "=" + encodeURIComponent(parameters[key]) }).join("&"));
    }
  }
}

export class GunsCovidEvents {
  OnRegisterSuccess(data) {
    console.log(data);
  }
  OnSubmiteVote(data) {
    console.log(data);
  }
  OnAverageDay(data) {
    console.log(data);
  }
  OnCrowdingTodayGaranhuns(data) {
    console.log(data);
  }
  OnUpdatePosition(data) {
    console.log(data);
  }
  OnCasesCovidGuns(data){
    console.log(data);
  }
  OnCasesCovidAllStates(data){
    console.log(data);
  }
  OnCasesCovidBrazil(data){
    console.log(data);
  }
  OnCasesCovidPe(data){
    console.log(data);
  }
  OnCasesCovidOfficialSources(data){
    console.log(data);
  }
  OnErrorTriggered(data) {
    console.log(data);
  }
}

export const GunsCovidResponses = {

  REGISTER_USER: {
    //UUID ARMAZENADO
    UUID_STORED: 1,
    //UUID INVALIDA
    UUID_INVALID: 2,
    //UUID JÁ ARMAZENADO
    UUID_ALREADY_STORED: 3,
    //UUID FALHADO
    UUID_FAILED: 4,
  },

  SUBMIT_VOTE: {
    //UUID INVALIDA
    UUID_INVALID: 2,
    //UUID FALHADO
    UUID_FAILED: 4,
    //VOTO INVALIDO
    VOTE_INVALID: 5,
    //MUITOS VOTOS
    TOO_MANY_VOTES: 6,
    //ERRO ENQUANTO ESTOU VOTANDO
    ERROR_WHEN_VOTING: 7,
    //VOTO SUBMITADO
    VOTE_SUBMITED: 8,
  },

  AVERAGE_DAY: {
    //UUID INVALIDA
    UUID_INVALID: 2,
    //UUID FALHADO
    UUID_FAILED: 4,
    //MEDIA ENVIADA COM SUCESSO
    AVERAGE_SUBMITED_SUCCESS: 9,
  },

  CASES_TODAY_GARANHUNS: {
    //UUID INVALIDA
    UUID_INVALID: 2,
    //UUID FALHADO
    UUID_FAILED: 4,
    //MEDIA MAXIMA E MINIMA ENVIADA COM SUCESSO
    AVERAGE_MAX_AND_MIN_AGLOMERATION_SUCCESS: 10,
  },

  UPDATE_POSITION: {
    //UUID INVALIDA
    UUID_INVALID: 2,
    //UUID FALHADO
    UUID_FAILED: 4,
    //ERRO EM ATUALIZAR A LOCALIZAÇÃO DO USUARIO
    ERROR_WHEN_UPDATE_USER_LOCATION: 11,
    //ERRO EM RETORNAR A LOCALIZAÇÃOL
    ERROR_WHEN_RETURN_USER_LOCATION: 12,
    //PARAMETRO IS_TRACKING INVALIDO
    IS_TRACKING_PARAMS_INVALID:               13,
    //DISPOSITIVO SENDO RASTREADO COM SUCESSO
    SUCCESSFULLY_TRACKED: 14,
  }

}

export class HttpPolling {

  private geolocation: Geolocation;
  private uuidsvc: UuidSvc;

  private pollingHandle: NodeJS.Timer;
  private isEnabled: Boolean = false;

  private pvoidAgglomeration: any;
  private pvoidUpdatePos: any;
  private pvoidCallbackError: any;
  private pollingCurrentInterval: number;
  private originThis: HomePage;

  constructor(pvoidAgglomeration, pvoidUpdPosition, pvoidErr, pollingInterval, protected storage: Storage, protected gps: Geolocation, origin: HomePage){
    this.pvoidAgglomeration = pvoidAgglomeration;
    this.pvoidUpdatePos = pvoidUpdPosition;
    this.pvoidCallbackError = pvoidErr;
    this.pollingCurrentInterval = pollingInterval || 2000;
    this.uuidsvc = new UuidSvc(this.storage);
    this.geolocation = gps;
    this.originThis = origin;
  }

  public beginPolling(){
    if (!this.isEnabled){
      this.isEnabled = true;

      let pvoidPollingStub = (data) => {
        let covidEvt = new GunsCovidEvents();
        let evtCount = 0;

        covidEvt.OnCrowdingTodayGaranhuns = (data) => {
          evtCount++;
          this.pvoidAgglomeration(data, this.originThis);
          if ((evtCount == 2)  && this.isEnabled){
            this.pollingHandle = setTimeout(pvoidPollingStub, this.pollingCurrentInterval);
          }
        }
        covidEvt.OnUpdatePosition = (data) => {
          evtCount++;
          this.pvoidUpdatePos(data, this.originThis);
          if ((evtCount == 2) && this.isEnabled){
            this.pollingHandle = setTimeout(pvoidPollingStub, this.pollingCurrentInterval);
          }
        }
        covidEvt.OnErrorTriggered = (error) => {
          evtCount++;
          this.pvoidCallbackError(error, this.originThis);
          if ((evtCount == 2)  && this.isEnabled){
            this.pollingHandle = setTimeout(pvoidPollingStub, this.pollingCurrentInterval);
          }
        }

        this.uuidsvc.getUuid((uuid) => {
          if (uuid == ''){
            console.error('Invalid uuid value.');
          }
          else{
            CovidApiService.crowdingTodayGaranhuns(covidEvt, uuid);
            this.geolocation.getCurrentPosition({ timeout: 3000 }).then((response) => {
              let data = { latitude: response.coords.latitude, longitude: response.coords.longitude };
              if (data.latitude && data.longitude){
                CovidApiService.updatePosition(covidEvt, uuid, data.latitude, data.longitude, 1);
              }
              else{
                CovidApiService.updatePosition(covidEvt, uuid, 0, 0, 0);
              }
            }).catch((reason) => {
              CovidApiService.updatePosition(covidEvt, uuid, 0, 0, 0);
            });
          }
        }, this.storage);
      }
      this.pollingHandle = setTimeout(pvoidPollingStub, this.pollingCurrentInterval);
    }
  }

  public stopPolling(){
    if (this.isEnabled){
      this.isEnabled = false;
      clearTimeout(this.pollingHandle);
    }
  }

}

export class GpsAPI {

  constructor(protected geolocation: Geolocation){}

  public ReadDevicePosition(pCallback){
    this.geolocation.getCurrentPosition({ timeout: 3000 }).then((val) => {
      pCallback({
        lat: val.coords.latitude,
        long: val.coords.longitude,
        accuracy: val.coords.accuracy,
        error: false
      });
    }).catch((reason) => {
        pCallback({ lat: 0, long: 0, error: true });
      }
    );
  }

}