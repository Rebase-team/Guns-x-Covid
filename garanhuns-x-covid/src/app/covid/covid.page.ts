import { Component } from '@angular/core';
import { CovidApiService, GunsCovidEvents, GunsCovidResponses } from '../services/covid-api.service';
import { Storage } from "@ionic/storage";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

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

  pe_source_url = "https://dados.seplag.pe.gov.br/apps/corona.html";

  constructor(private storage: Storage, private inapp: InAppBrowser) { }

  ionViewWillEnter() {
    this.casesCovidGuns();
    this.casesCovidPe();
    //this.officialSources();
  }

  officialSources(){
    let event = new GunsCovidEvents();
    event.OnCasesCovidOfficialSources = (data) => {
      let pe_src = "";
      let dataJSON = JSON.parse(data.data);
      for (let idx = 0; idx < dataJSON.parameters.length; idx++){
        if (dataJSON.parameters[idx].State = 'PE'){
          pe_src = dataJSON.parameters[idx].Url;
          console.log(dataJSON.parameters[idx])
          break;
        }
      }
      this.pe_source_url = pe_src;
    }
    event.OnErrorTriggered = (err) => {
      console.log(err);
    }
    this.storage.get('uuid').then((uuid) => {
      CovidApiService.casesCovidOfficialSources(event, uuid);
    });
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
  
  openSources(){
    if (this.pe_source_url){
      this.inapp.create(this.pe_source_url, '_system', 'location=yes');
    }
  }

}
