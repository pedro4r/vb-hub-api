"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTokenUseCase = void 0;
const auth_service_repository_1 = require("../../../../core/cryptography/auth-service-repository");
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const wrong_credentials_error_1 = require("./errors/wrong-credentials-error");
let VerifyTokenUseCase = class VerifyTokenUseCase {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async execute({ token, }) {
        const isValid = await this.authService.verifyToken(token);
        if (isValid) {
            return (0, either_1.right)({ status: 'authenticated' });
        }
        else {
            return (0, either_1.left)(new wrong_credentials_error_1.WrongCredentialsError());
        }
    }
};
exports.VerifyTokenUseCase = VerifyTokenUseCase;
exports.VerifyTokenUseCase = VerifyTokenUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_repository_1.AuthService])
], VerifyTokenUseCase);
//# sourceMappingURL=verify-token.js.map