"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = void 0;
const withRetry = async (promise, attemps) => {
    try {
        return await promise();
    }
    catch {
        return await withRetry(promise, attemps - 1);
    }
};
exports.withRetry = withRetry;
