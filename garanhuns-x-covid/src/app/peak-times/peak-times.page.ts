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
    },
  ]
  constructor() {}

}
