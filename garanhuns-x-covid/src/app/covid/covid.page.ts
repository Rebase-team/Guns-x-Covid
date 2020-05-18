import { Component } from '@angular/core';
import { CovidApiService, GunsCovidEvents } from '../services/covid-api.service';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-covid',
  templateUrl: './covid.page.html',
  styleUrls: ['./covid.page.scss'],
})
export class CovidPage {

  constructor(private covidApi: CovidApiService,
    private storage: Storage) { }

  ionViewWillEnter(){
    this.casesCovidGuns();
    this.casesCovidPe();
  }

  casesCovidGuns(){
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

  casesCovidPe(){
    let event = new GunsCovidEvents();
    event.OnCasesCovidPe = (data) => {
      let dataJSON = JSON.parse(data.data);
      console.log(dataJSON);
    }
    event.OnErrorTriggered = (error) => {
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      this.covidApi.casesCovidPe(event, uuid);
    });
  }
}
