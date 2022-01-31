"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const createResponse_1 = require("./createResponse");
const types_1 = require("./types");
const handleError = (error) => {
    let errors = [];
    let message = 'Whoops. We hit an unexpected error. Try again later. If the problem persists, contact support.';
    let status = 500;
    if ((0, types_1.isExtendedHttpError)(error)) {
        errors = error.errors;
        message = error.expose ? error.message : message;
        status = error.status;
    }
    return (0, createResponse_1.createResponse)({
        errors,
        message,
        payload: undefined,
        status,
    });
};
exports.handleError = handleError;
