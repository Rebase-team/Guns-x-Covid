import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class ReportProblemService {
  url = "https://api.telegram.org/bot1147599088:AAHrFuc1hSAgSEei3tuhGiJLsvS4rrh8z3M/sendMessage?chat_id=@gunscovid&text=";
  constructor(private http: HttpClient) { }

  reportProblem(message){
    this.http.get(this.url + message).subscribe((result) => {
      console.log(result);
    });
  }
}
