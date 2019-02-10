/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { ISessionBasket, SessionBasket } from '../app/zap-ts-models/session-basket';

let basketSess = new SessionBasket();

console.log("typeof basketSess", typeof basketSess);

let kalle1 = (basketSess instanceof SessionBasket);

//export function from<T>(input: ObservableInput<T>, scheduler?: SchedulerLike): Observable<T> {

console.log("kalle1 ::", kalle1);
//console.log("kalle2 ::", kalle2);
