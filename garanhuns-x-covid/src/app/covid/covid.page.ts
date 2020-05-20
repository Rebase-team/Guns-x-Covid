import { Component } from '@angular/core';
import { CovidApiService, GunsCovidEvents, GunsCovidResponses } from '../services/covid-api.service';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-covid',
  templateUrl: './covid.page.html',
  styleUrls: ['./covid.page.scss'],
})
export class CovidPage {
  dataGus = {
    cases: "0",
    recovered: "0",
    suspects: "0",
    deaths: "0",
  }

  dataPe = {
    confirm: "0",
    discarded: "0",
    suspect: "0",
    death: "0",
  }

  constructor(private storage: Storage) { }

  ionViewWillEnter() {
    this.casesCovidGuns();
    this.casesCovidPe();
  }

  casesCovidGuns() {
    let event = new GunsCovidEvents();
    event.OnCasesCovidGuns = (data) => {
      let dataJSON = JSON.parse(data.data);
      if (dataJSON.response != GunsCovidResponses.CASES_TODAY_GARANHUNS.UUID_INVALID){
        this.dataGus = dataJSON.parameters;
      }
    }
    event.OnErrorTriggered = (error) => {
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      CovidApiService.casesCovidGuns(event, uuid);
    });
  }

  casesCovidPe() {
    let event = new GunsCovidEvents();
    event.OnCasesCovidPe = (data) => {
      let dataJSON = JSON.parse(data.data);
      this.dataPe = {
        confirm: dataJSON.parameters.cases,
        discarded: dataJSON.parameters.refuses,
        suspect: dataJSON.parameters.suspects,
        death: dataJSON.parameters.deaths,
      }

    }
    event.OnErrorTriggered = (error) => {
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      CovidApiService.casesCovidPe(event, uuid);
    });
  }
}
