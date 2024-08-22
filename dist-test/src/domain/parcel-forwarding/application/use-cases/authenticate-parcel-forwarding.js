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
exports.AuthenticateUseCase = void 0;
const encrypter_1 = require("../../../../core/cryptography/encrypter");
const hash_compare_1 = require("../../../../core/cryptography/hash-compare");
const either_1 = require("../../../../core/either");
const parcel_forwardings_repository_1 = require("../repositories/parcel-forwardings-repository");
const wrong_credentials_error_1 = require("./errors/wrong-credentials-error");
const common_1 = require("@nestjs/common");
let AuthenticateUseCase = class AuthenticateUseCase {
    parcelforwardingsRepository;
    hashComparer;
    encrypter;
    constructor(parcelforwardingsRepository, hashComparer, encrypter) {
        this.parcelforwardingsRepository = parcelforwardingsRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
    }
    async execute({ email, password, }) {
        const parcelforwarding = await this.parcelforwardingsRepository.findByEmail(email);
        if (!parcelforwarding) {
            return (0, either_1.left)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const isPasswordValid = await this.hashComparer.compare(password, parcelforwarding.password);
        if (!isPasswordValid) {
            return (0, either_1.left)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const accessToken = await this.encrypter.encrypt({
            sub: parcelforwarding.id.toString(),
        });
        return (0, either_1.right)({
            accessToken,
        });
    }
};
exports.AuthenticateUseCase = AuthenticateUseCase;
exports.AuthenticateUseCase = AuthenticateUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [parcel_forwardings_repository_1.ParcelForwardingsRepository,
        hash_compare_1.HashComparer,
        encrypter_1.Encrypter])
], AuthenticateUseCase);
//# sourceMappingURL=authenticate-parcel-forwarding.js.map