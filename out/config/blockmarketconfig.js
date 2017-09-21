"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require('path');
const crypto = require('crypto');
const ServerConfig = {
    syscoin_config_path: path.join(electron_1.app.getPath('appData'), electron_1.app.getName(), 'syscoin.conf'),
    secret: crypto.randomBytes(32).toString('hex'),
    port: 8001,
    host: 'localhost',
    rpc_host: 'localhost'
};
exports.ServerConfig = ServerConfig;
const ClientConfig = {
    port: 8001,
    host: 'localhost'
};
exports.ClientConfig = ClientConfig;
const BlockmarketConfig = {
    server: ServerConfig,
    client: ClientConfig
};
exports.default = BlockmarketConfig;
//# sourceMappingURL=blockmarketconfig.js.map