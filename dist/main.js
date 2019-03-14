"use strict";
/**
 * Patrik Forsberg ("CREATOR") CONFIDENTIAL
 * Unpublished Copyright (c) 2015-2018 Patrik Forsberg, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of CREATOR. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current CREATOR employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  CREATOR.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF CREATOR IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 *
 * Created by Patrik Forsberg - 2018
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const kernel_config_1 = require("./kernel.config");
const app_settings_1 = require("@app/app.settings");
const cli_logger_1 = require("@cli/cli.logger");
const cli_config_file_1 = require("@cli/cli.config-file");
let Bootstrap = class Bootstrap {
    constructor() {
        kernel_config_1.kernel.get("IServerService");
    }
    createSettings(config) {
        let listenHost = (config.listenHost) ? config.listenHost : "127.0.0.1";
        let listenPort = (config.listenPort) ? config.port : 8080;
        return new app_settings_1.AppSettings(listenHost, listenPort);
    }
    /**
     * Execute the Server App
     * @returns {boolean}
     */
    run() {
        let config = new cli_config_file_1.CliConfigFile();
        try {
            let configData = config.getConfig();
            let settings = this.createSettings(configData);
            //this.app = new WebApp(settings);
            return true;
        }
        catch (err) {
            cli_logger_1.Logger.logError("Run Failed ::", err);
            return false;
        }
    }
};
Bootstrap = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], Bootstrap);
exports.Bootstrap = Bootstrap;
let bootstrap = new Bootstrap();
//main.run();
