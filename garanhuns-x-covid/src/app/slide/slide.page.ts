import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertService } from "src/app/services/alert.service";
import { GunsCovidEvents, GunsCovidResponses, CovidApiService } from '../services/covid-api.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
	selector: 'app-slide',
	templateUrl: './slide.page.html',
	styleUrls: ['./slide.page.scss'],
})
export class SlidePage {
	terms: boolean = true;
	spinner: boolean = false;
	uuid: string = "";

	constructor(private navigation: NavController,
		private storage: Storage,
		private alert: AlertService,
		private covidApi: CovidApiService) { }

	ionViewWillEnter(){
		this.uuid = uuidv4();
	}

	async btnGoHome() {
		if (this.terms == true) {
			this.registerUser();
		} else {
			this.alert.activeAlert("Termos não aceitos", "Você precisa aceitar os termos de uso para acessar o App.");
		}
	}

	private registerUser(){
		this.spinner = true;
		let event = new GunsCovidEvents();
		event.OnRegisterSuccess = (data) => {
			let dataJSON = JSON.parse(data.data);
			this.spinner = false;
			switch(dataJSON.response){
				case GunsCovidResponses.REGISTER_USER.UUID_STORED:
					this.storage.set("uuid", this.uuid);
					this.storage.set("firstAccess", false);
					this.navigation.navigateRoot("tabs");
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_ALREADY_STORED:
					this.storage.set("uuid", this.uuid);
					this.storage.set("firstAccess", false);
					this.navigation.navigateRoot("tabs");
					////
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_FAILED:
					////
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_INVALID:
					////
					break;
				default:

			}
		}
		event.OnErrorTriggered = (error) => {
			console.log(error);
		}
		CovidApiService.registerUser(event, this.uuid);
	}
}
