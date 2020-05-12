import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private navigation: NavController,
              private storage: Storage) { }

  ngOnInit() {
    this.storage.get("firstAccess").then((value) => {
      if (value == null || value == undefined){
        this.navigation.navigateRoot("slide");
      }
    });
  }

  btnGoHome(){
    this.navigation.navigateRoot("tabs");
  }
}
