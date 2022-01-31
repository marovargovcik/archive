"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponse = void 0;
const createResponse = ({ errors, message, payload, status, }) => {
    return {
        errors,
        message,
        payload,
        status,
    };
};
exports.createResponse = createResponse;
