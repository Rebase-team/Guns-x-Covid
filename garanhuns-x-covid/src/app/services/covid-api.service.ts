import { Injectable } from '@angular/core';
import { HTTP } from "@ionic-native/http";

@Injectable({
  providedIn: 'root'
})
export class CovidApiService {
  url = "http://api-covid.fun:14400/covid/";

  constructor(private http: HTTP) { }

  registerUser(event: GunsCovidEvents, uuid){
    this.http.put(this.url + "uuid/" + uuid, {}, {})
    .then(event.OnRegisterSuccess).catch(event.OnErrorTriggered)
  }

  submitVote(event: GunsCovidEvents, uuid, vote){
    this.http.post(this.url + "submit/" + uuid + "/" + vote, {}, {})
    .then(event.OnSubmiteVote).catch(event.OnErrorTriggered)
  }

  averageDay(event: GunsCovidEvents, uuid, day){
    this.http.get(this.url + "average/" + uuid + "/" + day, {}, {})
    .then(event.OnAverageDay).catch(event.OnErrorTriggered)
  }

  casesTodayGaranhuns(event: GunsCovidEvents, uuid){
    this.http.get(this.url + "today/" + uuid + "/garanhuns", {}, {})
    .then(event.OnCasesTodayGaranhuns).catch(event.OnErrorTriggered)
  }

  updatePosition(event: GunsCovidEvents, uuid, lat, lng, is_tracking){
    this.http.put(this.url + "track/" + uuid + "/" + lat + "/" + lng + "/" + is_tracking, {}, {})
    .then(event.OnUpdatePosition)
    .catch(event.OnErrorTriggered)
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