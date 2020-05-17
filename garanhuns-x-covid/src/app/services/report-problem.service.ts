import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class ReportProblemService {
  url = "";
  constructor(private http: HttpClient) { }

  reportProblem(message){
    this.http.get(this.url + message).subscribe((result) => {
      console.log(result);
    });
  }
}
