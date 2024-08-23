"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAllowedError = void 0;
class NotAllowedError extends Error {
    constructor(msg) {
        super(`Not allowed: ${msg}`);
    }
}
exports.NotAllowedError = NotAllowedError;
//# sourceMappingURL=not-allowed-error.js.map