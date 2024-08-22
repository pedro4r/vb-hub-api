"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrong_credentials_error_1 = require("./errors/wrong-credentials-error");
const verify_token_1 = require("./verify-token");
const fake_auth_service_1 = require("../../../../../test/cryptography/fake-auth-service");
let verifyToken;
let sut;
describe('Verify Token', () => {
    beforeEach(() => {
        verifyToken = new fake_auth_service_1.FakeAuthService();
        sut = new verify_token_1.VerifyTokenUseCase(verifyToken);
    });
    it('should verify token', async () => {
        const result = await sut.execute({
            token: 'valid_token',
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            status: 'authenticated',
        });
        const result2 = await sut.execute({
            token: 'vali',
        });
        expect(result2.isLeft()).toBe(true);
        expect(result2.value).toBeInstanceOf(wrong_credentials_error_1.WrongCredentialsError);
    });
});
//# sourceMappingURL=verify-token.test.js.map