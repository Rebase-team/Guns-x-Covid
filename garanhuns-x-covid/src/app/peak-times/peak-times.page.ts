import { Component } from '@angular/core';
import { CovidApiService, GunsCovidEvents, GunsCovidResponses } from '../services/covid-api.service';
import { Storage } from "@ionic/storage";
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-peak-times',
  templateUrl: 'peak-times.page.html',
  styleUrls: ['peak-times.page.scss']
})
export class PeakTimes {
  currentDay = new Date().getDay();
  listDaysPortuguese = [
    { day: "Domingo", id: 0, },
    { day: "Segunda", id: 1, },
    { day: "Terça", id: 2, },
    { day: "Quarta", id: 3, },
    { day: "Quinta", id: 4, },
    { day: "Sexta", id: 5, },
    { day: "Sábado", id: 6, }
  ];

  listPeakTimes = [
    {
      time: "06:00 às 08:00",
      crowding: { msg: "~", color: "dark" }
    },
    {
      time: "08:00 às 10:00",
      crowding: { msg: "~", color: "dark" }
    },
    {
      time: "10:00 às 12:00",
      crowding: { msg: "~", color: "dark" }
    },
    {
      time: "12:00 às 14:00",
      crowding: { msg: "~", color: "dark" }
    },
    {
      time: "14:00 às 16:00",
      crowding: { msg: "~", color: "dark" }
    },
    {
      time: "16:00 às 18:00",
      crowding: { msg: "~", color: "dark" }
    }
  ];
  
  constructor(private storage: Storage,
    private alert: AlertService) { }

  ionViewWillEnter() {
    this.btnAverageDay();
  }

  btnAverageDay() {
    let event = new GunsCovidEvents();

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
                  msg: msgStatusCrowding(dataJSON.parameters[x].Measure),
                  color: colorStatusCrowding(dataJSON.parameters[x].Measure)}
              };
              y += 1;
            }
          }
          break;
        case GunsCovidResponses.AVERAGE_DAY.UUID_FAILED:
          this.alert.activeAlert("Tente escolher o dia novamente", "Falha no UUID.");
          break;
        case GunsCovidResponses.AVERAGE_DAY.UUID_INVALID:
          this.alert.activeAlert("Tente escolher o dia novamente", "UUID inválido.");
          break;
        default:
          this.alert.activeAlert("Tente escolher o dia novamente", "Problema inesperado.");
      }
    }
    event.OnErrorTriggered = (error) => {
      console.log(error);
    }
    this.storage.get("uuid").then((uuid) => {
      CovidApiService.averageDay(event, uuid, this.currentDay);
    })
  }
}
