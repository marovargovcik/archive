"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomId = void 0;
const node_crypto_1 = require("node:crypto");
const generateRandomId = () => (0, node_crypto_1.randomBytes)(16).toString('hex');
exports.generateRandomId = generateRandomId;
