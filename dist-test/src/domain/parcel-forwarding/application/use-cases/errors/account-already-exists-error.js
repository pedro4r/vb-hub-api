"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAlreadyExistsError = void 0;
class AccountAlreadyExistsError extends Error {
    constructor(identifier) {
        super(`Account "${identifier}" already exists.`);
    }
}
exports.AccountAlreadyExistsError = AccountAlreadyExistsError;
//# sourceMappingURL=account-already-exists-error.js.map