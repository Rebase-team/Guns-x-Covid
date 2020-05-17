import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoCrowdingService {

  constructor() { }

  msgStatusCrowding(value){
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

  colorStatusCrowding(value){
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
}
