"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const createError = (code, message, properties) => (0, http_errors_1.default)(code, message, properties);
exports.createError = createError;
