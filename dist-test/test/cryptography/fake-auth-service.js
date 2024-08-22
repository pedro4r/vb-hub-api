"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeAuthService = void 0;
class FakeAuthService {
    async verifyToken(token) {
        if (token.length > 5) {
            return true;
        }
        return false;
    }
}
exports.FakeAuthService = FakeAuthService;
//# sourceMappingURL=fake-auth-service.js.map