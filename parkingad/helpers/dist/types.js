"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExtendedHttpError = exports.isApiFieldError = void 0;
const http_errors_1 = require("http-errors");
const isApiFieldError = (object) => {
    return (typeof object.message === 'string' && typeof object.source === 'string');
};
exports.isApiFieldError = isApiFieldError;
const isExtendedHttpError = (error) => {
    return ((0, http_errors_1.isHttpError)(error) &&
        Array.isArray(error.errors) &&
        error.errors.every(isApiFieldError) &&
        typeof error.expose === 'boolean');
};
exports.isExtendedHttpError = isExtendedHttpError;
