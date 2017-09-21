"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const process = require('process');
const path = require('path');
const isDev = require('electron-is-dev');
class Wallet {
    constructor(app) {
        this.syscoind = '';
        this.syscoinCli = '';
        this.blockmarketConfigPath = '';
        this.syscoinConfigPath = '';
        this.application = app;
        this.appPath = isDev ? path.join(__dirname, '..') : app.getAppPath();
        this.blockmarketConfigPath = path.join(app.getPath('appData'), app.getName(), 'Blockmarket.json');
        this.blockmarketConfig = require(this.blockmarketConfigPath);
        this.syscoinConfigPath = this.blockmarketConfig.server.syscoin_config_path;
        this.isWin64 = process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
        this.isWin32 = process.platform === 'win32' && !this.isWin64;
        this.isDarwin = process.platform === 'darwin';
        if (this.isDarwin) {
            this.syscoind = path.join(this.appPath, '..', 'bin', 'darwin', 'syscoind');
            this.syscoinCli = path.join(this.appPath, '..', 'bin', 'darwin', 'syscoin-cli');
        }
        else if (this.isWin32) {
            this.syscoind = path.join(this.appPath, '..', 'bin', 'win32', 'syscoind.exe');
            this.syscoinCli = path.join(this.appPath, '..', 'bin', 'win32', 'syscoin-cli.exe');
        }
        else if (this.isWin64) {
            this.syscoind = path.join(this.appPath, '..', 'bin', 'win64', 'syscoind.exe');
            this.syscoinCli = path.join(this.appPath, '..', 'bin', 'win64', 'syscoin-cli.exe');
        }
    }
    start(debug = false) {
        if (this.syscoind !== '') {
            const args = [
                '-conf=' + this.syscoinConfigPath
            ];
            if (debug) {
                args.push('-debug');
            }
            child_process_1.spawn(this.syscoind, args, { detached: true });
        }
    }
    stop(callback) {
        if (this.syscoinCli !== '') {
            const args = [
                '-conf=' + this.syscoinConfigPath,
                'stop'
            ];
            const syscoinCliProcess = child_process_1.spawn(this.syscoinCli, args);
            syscoinCliProcess.on('close', () => {
                callback();
            });
        }
    }
}
exports.default = Wallet;
//# sourceMappingURL=wallet.js.map