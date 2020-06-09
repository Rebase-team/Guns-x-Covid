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
export class SlidePage{
	terms: boolean = false;
	spinner: boolean = false;
	uuid: string = "";

	constructor(private navigation: NavController,private storage: Storage,private alert: AlertService) { }

	async btnGoHome() {
		if (this.terms == true) {
			this.registerUser();
		} else {
			this.alert.activeAlert("Termos não aceitos", "Você precisa aceitar os termos de uso para acessar o App.");
		}
	}

	private registerUser(){
		this.spinner = true;
		this.uuid = uuidv4();
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
					this.alert.activeAlert("Já cadastrado", "Usuário já está cadastrado");
					this.navigation.navigateRoot("tabs");
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_FAILED:
					this.alert.activeAlert("Tente acessar novamente", "Falha no UUID.");
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_INVALID:
					this.alert.activeAlert("Tente acessar novamente", "UUID inválido.");
					break;
				default:
					this.alert.activeAlert("Tente acessar novamente", "Problema inesperado.");
			}
		}
		
		event.OnErrorTriggered = (error) => {
			this.spinner = false;
		}
		this.storage.get('firstAccess').then(val => {
			if (!val){
				CovidApiService.registerUser(event, this.uuid);
			}
		})
		
	}
}
