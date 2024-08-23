"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceNotFoundError = void 0;
class ResourceNotFoundError extends Error {
    constructor(msg) {
        super(`Resource not found: ${msg}`);
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
//# sourceMappingURL=resource-not-found-error.js.map