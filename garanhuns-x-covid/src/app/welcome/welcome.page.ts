import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from "@ionic/storage";
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private localStorage: Storage,
              private navigation: NavController) { }

  ngOnInit() {
    this.localStorage.get("firstAccess").then((value) => {
      if (value == null || value == undefined){
        this.localStorage.set("firstAccess", false);
        this.navigation.navigateRoot("slide");
      }
    });
  }

}
