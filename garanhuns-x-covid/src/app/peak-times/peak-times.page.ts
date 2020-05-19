import { Component } from '@angular/core';
import { CovidApiService, GunsCovidEvents, GunsCovidResponses } from '../services/covid-api.service';
import { Storage } from "@ionic/storage";
import { InfoCrowdingService } from '../services/info-crowding.service';

@Component({
  selector: 'app-peak-times',
  templateUrl: 'peak-times.page.html',
  styleUrls: ['peak-times.page.scss']
})
export class PeakTimes {
  currentDay = new Date().getDay();
  listDaysPortuguese = [
    {
      day: "Domingo",
      id: 0,
    },
    {
      day: "Segunda",
      id: 1,
    },
    {
      day: "Terça",
      id: 2,
    },
    {
      day: "Quarta",
      id: 3,
    },
    {
      day: "Quinta",
      id: 4,
    },
    {
      day: "Sexta",
      id: 5,
    },
    {
      day: "Sábado",
      id: 6,
    }];

  listPeakTimes = [
    {
      time: "06:00 às 08:00",
      crowding: {
        msg: "~",
        color: "dark"}
    },
    {
      time: "08:00 às 10:00",
      crowding: {
        msg: "~",
        color: "dark"}
    },
    {
      time: "10:00 às 12:00",
      crowding: {
        msg: "~",
        color: "dark"}
    },
    {
      time: "12:00 às 14:00",
      crowding: {
        msg: "~",
        color: "dark"}
    },
    {
      time: "14:00 às 16:00",
      crowding: {
        msg: "~",
        color: "dark"}
    },
    {
      time: "16:00 às 18:00",
      crowding: {
        msg: "~",
        color: "dark"}
    }];
  
  constructor(private covidApi: CovidApiService,
              private storage: Storage,
              private infoCrowding: InfoCrowdingService) { }

  ionViewWillEnter() {
    this.btnAverageDay();
  }

  btnAverageDay() {
    let event = new GunsCovidEvents();
    event.OnAverageDay = (data) => {
      let dataJSON = JSON.parse(data.data);
      switch (dataJSON.response) {
        case GunsCovidResponses.AVERAGE_DAY.AVERAGE_SUBMITED_SUCCESS:
          let y = 0;
          for (let x = 0; x < dataJSON.parameters.length; x++) {
            if (Number(dataJSON.parameters[x].Start.substring(0, 2)) >= 6 &&
              Number(dataJSON.parameters[x].End.substring(0, 2)) <= 18) {
              this.listPeakTimes[y] = {
                time: dataJSON.parameters[x].Start + " às " + dataJSON.parameters[x].End,
                crowding: {
                  msg: this.infoCrowding.msgStatusCrowding(dataJSON.parameters[x].Measure),
                  color: this.infoCrowding.colorStatusCrowding(dataJSON.parameters[x].Measure)}
              };
              y += 1;
            }
          }
          break;
        case GunsCovidResponses.AVERAGE_DAY.UUID_FAILED:
          ////
          break;
        case GunsCovidResponses.AVERAGE_DAY.UUID_INVALID:
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
      CovidApiService.averageDay(event, uuid, this.currentDay);
    })
  }
}
