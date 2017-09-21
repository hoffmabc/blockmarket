"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const ini = require("ini");
const electron_1 = require("electron");
const main_1 = require("./main");
const logger_1 = require("./logger/logger");
const blockmarketconfig_1 = require("./config/blockmarketconfig");
const syscoinconfig_1 = require("./config/syscoinconfig");
const blockmarketGlobal = global;
const path = require('path');
const Hashes = require('jshashes');
const argv = process.argv.slice(1);
const options = { debug: false };
for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dev') {
        options.debug = true;
    }
}
const blockmarketConfigDefaults = blockmarketconfig_1.default;
const blockmarketPath = path.join(electron_1.app.getPath('appData'), electron_1.app.getName());
const blockmarketConfigPath = path.join(blockmarketPath, 'Blockmarket.json');
const syscoinConfigDefaults = syscoinconfig_1.default;
const initializeBlockmarketConfig = () => {
    try {
        if (fs.statSync(blockmarketConfigPath)) {
            initializeSyscoinConfig();
        }
    }
    catch (err) {
        try {
            fs.mkdirSync(blockmarketPath);
            fs.writeFileSync(blockmarketConfigPath, JSON.stringify(blockmarketConfigDefaults), 'utf-8');
            initializeSyscoinConfig();
        }
        catch (e) {
        }
    }
};
const initializeSyscoinConfig = () => {
    const config = require(blockmarketConfigPath);
    try {
        if (fs.statSync(config.server.syscoin_config_path)) {
            initializeApplication();
        }
    }
    catch (err) {
        try {
            fs.writeFileSync(config.server.syscoin_config_path, ini.stringify(syscoinConfigDefaults), 'utf-8');
            initializeApplication();
        }
        catch (e) {
        }
    }
};
const initializeApplication = () => {
    const config = require(blockmarketConfigPath);
    const syscoin = ini.parse(fs.readFileSync(config.server.syscoin_config_path, 'utf-8'));
    config.client.api_token = new Hashes.SHA1().hex(`${syscoin.rpcuser}${syscoin.rpcpassword}`);
    blockmarketGlobal.blockmarket = {
        config: config.client,
    };
    require('./api/index');
    require('electron-context-menu')();
    logger_1.default.initialize(electron_1.app, options);
    main_1.default.main(electron_1.app, electron_1.BrowserWindow, options);
};
initializeBlockmarketConfig();
//# sourceMappingURL=app.js.map