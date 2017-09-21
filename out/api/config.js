"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require('path');
const blockMarketConfigPath = path.join(electron_1.app.getPath('appData'), electron_1.app.getName(), 'Blockmarket.json');
const blockMarketConfig = require(blockMarketConfigPath);
const config = {
    syscoin_config_path: blockMarketConfig.server.syscoin_config_path,
    api_secret: blockMarketConfig.server.secret,
    secure: true,
    port: blockMarketConfig.server.port,
    host: blockMarketConfig.server.host,
    rpc_host: blockMarketConfig.server.rpc_host
};
module.exports = config;
//# sourceMappingURL=config.js.map