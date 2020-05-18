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
    confirm: "0",
    recovered: "0",
    suspect: "0",
    death: "0",
  }

  dataPe = {
    confirm: "0",
    discarded: "0",
    suspect: "0",
    death: "0",
  }

  constructor(private covidApi: CovidApiService,
    private storage: Storage) { }

  ionViewWillEnter() {
    this.casesCovidGuns();
    this.casesCovidPe();
  }

  casesCovidGuns() {
    let event = new GunsCovidEvents();
    event.OnCasesCovidGuns = (data) => {
      let dataJSON = JSON.parse(data.data);
      console.log(dataJSON);
    }
    event.OnErrorTriggered = (error) => {
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      this.covidApi.casesCovidGuns(event, uuid);
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
      this.covidApi.casesCovidPe(event, uuid);
    });
  }
}
