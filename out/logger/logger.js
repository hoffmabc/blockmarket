"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
const path = require('path');
class Logger {
    static initialize(app, options) {
        this.application = app;
        const logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    name: 'console',
                    level: 'debug'
                }),
                new (winston.transports.File)({
                    name: 'debug-file',
                    level: 'debug',
                    filename: path.join(app.getPath('appData'), app.getName(), 'debug.log')
                })
            ]
        });
        if (options.debug === undefined || !options.debug) {
            logger.remove('console');
            logger.remove('debug-file');
        }
        console.debug = (buffer) => {
            logger.log('debug', buffer);
        };
        console.error = logger.error;
        console.warn = logger.warn;
        console.log = logger.debug;
        console.dir = console.debug;
        console.info = logger.info;
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map