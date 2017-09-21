"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const wallet_1 = require("./wallet/wallet");
require('electron-debug')({ showDevTools: true });
class Main {
    static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }
    static onClose(e) {
        if (Main.killedWallet === true) {
            Main.mainWindow = null;
        }
        else {
            if (process.platform == 'darwin') {
                e.preventDefault();
                Main.mainWindow.hide();
            }
            else {
                Main.mainWindow = null;
            }
        }
    }
    static onActivate() {
        Main.mainWindow.show();
    }
    static onReady() {
        Main.application.commandLine.appendSwitch('disable-web-security');
        Main.mainWindow = new Main.BrowserWindow({
            minWidth: 800,
            minHeight: 600,
            width: 1000,
            height: 600,
            'web-preferences': {
                'web-security': false
            },
            show: false
        });
        Main.mainWindow.loadURL('file://' + __dirname + '/index.html');
        Main.mainWindow.on('close', Main.onClose);
        Main.mainWindow.on('ready-to-show', () => {
            Main.mainWindow.show();
            Main.mainWindow.focus();
        });
        electron_1.ipcMain.on('relaunchBM', () => {
            Main.application.relaunch();
            Main.application.quit();
        });
        electron_1.ipcMain.on('quitBM', () => {
            Main.application.quit();
        });
        Main.createMenu();
    }
    static createMenu() {
        let menuTemplate = [];
        menuTemplate.push({
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'delete' },
                { role: 'selectall' }
            ]
        });
        if (Main.debug) {
            menuTemplate.push({
                label: 'Tools',
                submenu: [
                    {
                        label: 'Open devTools',
                        click() {
                            Main.mainWindow.webContents.openDevTools();
                        }
                    }, {
                        label: 'Close devTools',
                        click() {
                            Main.mainWindow.webContents.closeDevTools();
                        }
                    }
                ]
            });
        }
        menuTemplate.push({
            label: 'About',
            submenu: [
                {
                    label: 'Syscoin website',
                    click() {
                        require('electron').shell.openExternal('http://www.syscoin.org');
                    }
                }, {
                    label: 'Blockchain Foundry website',
                    click() {
                        require('electron').shell.openExternal('http://www.blockchainfoundry.co');
                    }
                }
            ]
        });
        if (process.platform === 'darwin') {
            menuTemplate.unshift({
                label: Main.application.getName(),
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            });
        }
        const menu = electron_1.Menu.buildFromTemplate(menuTemplate);
        electron_1.Menu.setApplicationMenu(menu);
    }
    static main(app, browserWindow, options) {
        Main.debug = options.debug || false;
        Main.Wallet = new wallet_1.default(app);
        Main.Wallet.start(Main.debug);
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('activate', Main.onActivate);
        Main.application.on('ready', Main.onReady);
        Main.application.on('before-quit', (event) => {
            if (!Main.killedWallet)
                event.preventDefault();
            Main.Wallet.stop(() => {
                Main.killedWallet = true;
                Main.application.quit();
            });
        });
    }
}
Main.killedWallet = false;
Main.debug = false;
exports.default = Main;
//# sourceMappingURL=main.js.map