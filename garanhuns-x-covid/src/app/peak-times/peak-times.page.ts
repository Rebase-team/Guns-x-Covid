import { Component } from '@angular/core';

@Component({
  selector: 'app-peak-times',
  templateUrl: 'peak-times.page.html',
  styleUrls: ['peak-times.page.scss']
})
export class PeakTimes {
  currentDay = new Date().getDay();
  listDaysPortuguese = [
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
      level: "Alto"
    },
    {
      time: "08:00 às 10:00",
      level: "Alto"
    },
    {
      time: "10:00 às 12:00",
      level: "Alto"
    },
    {
      time: "12:00 às 14:00",
      level: "Alto"
    },
    {
      time: "14:00 às 16:00",
      level: "Alto"
    },
    {
      time: "16:00 às 18:00",
      level: "Alto"
    }];
  constructor() {}

}
