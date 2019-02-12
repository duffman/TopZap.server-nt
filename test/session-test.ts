/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {SessionService} from '@app/services/session.service';
import {resolveInstance} from 'inversify/dts/resolution/instantiation';
import {ISessionBasket} from '@zapModels/session-basket';


let service = new SessionService();
let sessionId = "ABC345890348";

let data = {
	id: "kalle",
	data: "Hohoho balle kuling"
};

function saveSessionData(data: any): Promise<boolean> {
	return new Promise((resolve, reject) => {
		service.saveSession(sessionId, data).then(res => {
			console.log("Session Saved");
			resolve(res);
		}).catch(saveErr => {
			console.log("Failed to saveSession", saveErr);
			reject(saveErr);
		});
	});
}

function getSession(): Promise<any> {
	return new Promise((resolve, reject) => {
		return service.getSession(sessionId).then(sessionData => {
			console.log("Session from DB::", sessionData);
			resolve(sessionData);
		}).catch(err => {
			console.log("Failed to get Session", err);
			reject(err);
		});
	});
}


saveSessionData(data).then(res => {
	console.log("Session Saved ::", res);

}).catch(err => {
	console.log("handeled ::", err);
});

