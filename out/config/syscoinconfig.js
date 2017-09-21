"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
const SyscoinConfig = {
    rpcuser: crypto.randomBytes(8).toString('hex'),
    rpcpassword: crypto.randomBytes(16).toString('hex'),
    rpcport: 8368,
    rpcallowip: '127.0.0.1'
};
exports.default = SyscoinConfig;
//# sourceMappingURL=syscoinconfig.js.map