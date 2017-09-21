"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const api_1 = require("./api");
const config = require('./config');
const syscoin = require('syscoin');
let rpchost = config.rpc_host;
let rpcuser = '';
let rpcpass = '';
let rpcport = '';
const inputStream = fs.createReadStream(config.syscoin_config_path);
inputStream.on('error', (e) => {
    console.log('Error reading syscoin.conf specified at ' + config.syscoin_config_path + ' falling back to defaults. Exact error is:' + JSON.stringify(e));
    console.log('syscoin.conf must be present, with rpcuser, rpcpassword, and rpcport set in order to run the Syscoin API Server.');
});
const lineReader = require('readline').createInterface({
    input: inputStream
});
lineReader.on('line', (line) => {
    if (line.indexOf('rpcuser') != -1) {
        rpcuser = line.substr(line.indexOf('=') + 1);
    }
    if (line.indexOf('rpcpassword') != -1) {
        rpcpass = line.substr(line.indexOf('=') + 1);
    }
    if (line.indexOf('rpcport') != -1) {
        rpcport = line.substr(line.indexOf('=') + 1);
    }
});
lineReader.on('close', () => {
    exports.syscoinClient = new syscoin.Client({
        host: rpchost,
        port: rpcport,
        user: rpcuser,
        pass: rpcpass,
        timeout: 30000
    });
    exports.rpcuser = rpcuser;
    exports.rpcpass = rpcpass;
    api_1.default.initSwagger();
    api_1.default.initHttp();
});
//# sourceMappingURL=index.js.map