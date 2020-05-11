import { Component, OnInit } from '@angular/core';
import { Device } from "@ionic-native/device/ngx";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private device: Device) { }

  ngOnInit() {
    console.log(this.device.uuid);
  }

}
