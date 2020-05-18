import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertService } from "src/app/services/alert.service";
import { GunsCovidEvents, GunsCovidResponses, CovidApiService } from '../services/covid-api.service';
import { ReportProblemService } from '../services/report-problem.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
	selector: 'app-slide',
	templateUrl: './slide.page.html',
	styleUrls: ['./slide.page.scss'],
})
export class SlidePage {
	terms: boolean = true;
	spinner: boolean = false;

	constructor(private navigation: NavController,
		private storage: Storage,
		private alert: AlertService,
		private covidApi: CovidApiService,
		private report: ReportProblemService,
		private uniqueDeviceID: UniqueDeviceID,
		private androidPermissions: AndroidPermissions) { }

	//Permissão de pegar UUID
	btnGetPermission() {
		this.androidPermissions.checkPermission(
			this.androidPermissions.PERMISSION.READ_PHONE_STATE
		).then(res => {
			if (res.hasPermission) {
				this.goHome();
			} else {
				this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then((response) => {
					this.alert.activeAlert("Permissão concedida", "Reinicie o App, por favor.");
				}).catch(error => {
					this.alert.activeAlert("Problema inesperado", "Tente novamente.");
				});
			}
		}).catch((error) => {
			this.alert.activeAlert("Tente novamente", "Falha ao tentar permitir identificação do dispositivo.");
		});
	}

	private async goHome() {
		if (this.terms == true) {
			this.uniqueDeviceID.get()
				.then((uuid) => {
					console.log(uuid);
					this.registerUser(uuid);
				});
		} else {
			this.alert.activeAlert("Termos não aceitos", "Você precisa aceitar os termos de uso para acessar o App.");
		}
	}

	private registerUser(uuid) {
		this.spinner = true;
		let event = new GunsCovidEvents();
		event.OnRegisterSuccess = (data) => {
			this.spinner = false;
			let dataJSON = JSON.parse(data.data);
			switch (dataJSON.response) {
				case GunsCovidResponses.REGISTER_USER.UUID_STORED:
					this.storage.set("firstAccess", false);
					this.storage.set("uuid", uuid);
					this.navigation.navigateRoot("tabs");
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_ALREADY_STORED:
					this.alert.activeAlert("Já cadastrado", "Dispositivo já está cadastrado no sistema.");
					this.storage.set("firstAccess", false);
					this.storage.set("uuid", uuid);
					this.navigation.navigateRoot("tabs");
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_FAILED:
					this.report.reportProblem("Cadastro: falha ao cadastrar UUID.");
					this.alert.activeAlert("Falha ao cadastrar o dispositivo", "Verifique sua conexão com à internet.");
					break;
				case GunsCovidResponses.REGISTER_USER.UUID_INVALID:
					this.report.reportProblem("Cadastro: UUID inválido.");
					this.alert.activeAlert("Tente novamente o acesso.", "Identificação inválida.");
					break;
				default:
					this.report.reportProblem("Cadastro:erro inesperado.");
					this.alert.activeAlert("Tente novamente o acesso.", "Algo inesperado ocorreu.");
			}
		}
		event.OnErrorTriggered = (error) => {
			this.spinner = false;
			console.log(error);
		}
		this.covidApi.registerUser(event, uuid);
	}

}
