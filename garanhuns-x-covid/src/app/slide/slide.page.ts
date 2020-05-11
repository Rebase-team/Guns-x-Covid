import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.page.html',
  styleUrls: ['./slide.page.scss'],
})
export class SlidePage implements OnInit {
  terms: boolean = true;
  constructor(private navigation: NavController,
  			  private alert: AlertController,
  			  private storage: Storage) { }

  ngOnInit() {
  }

  async btnGoHome(){
  	if (this.terms == true){
  		this.storage.set("firstAccess", false);
  		this.navigation.navigateForward("tabs");
  	}else{
  		this.storage.remove("firstAccess");
  		const alert = await this.alert.create({
  			header: "Termos não aceitos",
  			message: "Você precisa aceitar os termos de uso para acessar o App.",
  			buttons: [
  			{
  				text: "Entendi"
  			}]
  		});
  		alert.present();
  	}
  }
}
