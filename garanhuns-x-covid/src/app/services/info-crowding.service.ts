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
      1.5: "success", 
      2: "primary",
      2.5: "secondary",
      3: "warning", 
      3.5: "orange",
      4: "danger"
    }[value]
  }
}
