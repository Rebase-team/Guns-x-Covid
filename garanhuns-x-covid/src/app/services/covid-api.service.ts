import { Injectable } from '@angular/core';
import { HTTP } from "@ionic-native/http/ngx"

const __UNSECURE_DEBUG_MODE = true;

@Injectable({
  providedIn: 'root'
})
export class CovidApiService {
  static url = "https://api-covid.fun/covid/";

  static registerUser(event: GunsCovidEvents, uuid){
    this.PutHttpRequest(CovidApiService.url + "uuid/" + uuid, {}, {}, event.OnRegisterSuccess, event.OnErrorTriggered);
  }

  static submitVote(event: GunsCovidEvents, uuid, vote){
    this.PostHttpRequest(CovidApiService.url + "submit/" + uuid + "/" + vote, {}, {}, event.OnSubmiteVote, event.OnErrorTriggered);
  }

  static averageDay(event: GunsCovidEvents, uuid, day){
    this.GetHttpRequest(CovidApiService.url + "average/" + uuid + "/" + day, {}, {}, event.OnAverageDay, event.OnErrorTriggered);
  }

  static casesTodayGaranhuns(event: GunsCovidEvents, uuid){
    this.GetHttpRequest(CovidApiService.url + "today/" + uuid + "/garanhuns", {}, {}, event.OnCasesTodayGaranhuns, event.OnErrorTriggered);
  }

  static updatePosition(event: GunsCovidEvents, uuid, lat, lng, is_tracking){
    this.PutHttpRequest(CovidApiService.url + "track/" + uuid + "/" + lat + "/" + lng + "/" + is_tracking, {}, {}, event.OnUpdatePosition, event.OnErrorTriggered);
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
      xhr.open("GET", addr + "?" + Object.keys(parameters).map(function (key) { return key + "=" + encodeURIComponent(parameters[key]) }).join("&"), true);
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
  OnRegisterSuccess(data){
    console.log(data);
  }
  OnSubmiteVote(data){
    console.log(data);
  }
  OnAverageDay(data){
    console.log(data);
  }
  OnCasesTodayGaranhuns(data){
    console.log(data);
  }
  OnUpdatePosition(data){
    console.log(data);
  }
  OnErrorTriggered(data){
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
    //LOCALIZAÇÃO DO USER RETORNADA COM SUCESSO
    USER_LOCATION_SUCCESS_RETURNED: 15,
  }

}