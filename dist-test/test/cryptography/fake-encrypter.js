"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeEncrypter = void 0;
class FakeEncrypter {
    async encrypt(payload) {
        return JSON.stringify(payload);
    }
}
exports.FakeEncrypter = FakeEncrypter;
//# sourceMappingURL=fake-encrypter.js.map