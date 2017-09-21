"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const http = require("http");
const config = require('./config');
const app = require('connect')();
const cors = require('cors');
const jsyaml = require('js-yaml');
const jwt = require('jsonwebtoken');
const swaggerTools = require('swagger-tools');
class Api {
    static initSwagger() {
        Api.swaggerOptions = {
            swaggerUiDir: __dirname + '/swagger-ui',
            controllers: __dirname + '/controllers',
            useStubs: (process.env.NODE_ENV === 'development')
        };
        const spec = fs.readFileSync(__dirname + '/config/swagger.yaml', 'utf8');
        Api.swaggerDoc = jsyaml.safeLoad(spec);
    }
    static initHttp() {
        app.use(cors({
            "origin": "*",
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false
        }));
        swaggerTools.initializeMiddleware(Api.swaggerDoc, (middleware) => {
            app.use(middleware.swaggerMetadata());
            const securityOptions = {
                token: authCheck
            };
            app.use(middleware.swaggerSecurity(securityOptions));
            app.use(middleware.swaggerValidator());
            app.use(middleware.swaggerRouter(Api.swaggerOptions));
            app.use(middleware.swaggerUi(Api.swaggerOptions));
            http.createServer(app).listen(config.port, () => {
                console.log('Your server is listening on port %d (http://%s:%d)', config.port, config.host, config.port);
                console.log('Swagger-ui is available on http://%s:%d/docs', config.host, config.port);
            });
        });
        const authCheck = (req, authOrSecDef, scopesOrApiKey, callback) => {
            const authToken = req.headers.token || (req.token ? req.token.value : null);
            console.log('Performing security check for TOKEN:', authToken);
            if (authToken) {
                jwt.verify(authToken, config.api_secret, (err, decoded) => {
                    if (err) {
                        console.log('VERIFY ERROR: ' + err);
                        return callback({
                            message: 'Invalid token.',
                            code: 'InvalidToken',
                            statusCode: 401,
                            headers: []
                        });
                    }
                    else {
                        callback();
                    }
                });
            }
            else {
                callback({
                    message: 'No token provided.',
                    code: 'NoTokenProvided',
                    statusCode: 401,
                    headers: []
                });
            }
        };
    }
}
exports.default = Api;
//# sourceMappingURL=api.js.map