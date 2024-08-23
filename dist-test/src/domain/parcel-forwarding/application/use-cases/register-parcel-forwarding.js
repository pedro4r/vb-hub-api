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
exports.RegisterParcelForwardingUseCase = void 0;
const either_1 = require("../../../../core/either");
const parcel_forwardings_repository_1 = require("../repositories/parcel-forwardings-repository");
const parcel_forwarding_1 = require("../../enterprise/entities/parcel-forwarding");
const hash_generator_1 = require("../../../../core/cryptography/hash-generator");
const user_already_exists_error_1 = require("../../../../core/errors/errors/user-already-exists-error");
const common_1 = require("@nestjs/common");
let RegisterParcelForwardingUseCase = class RegisterParcelForwardingUseCase {
    parcelforwardingsRepository;
    hashGenerator;
    constructor(parcelforwardingsRepository, hashGenerator) {
        this.parcelforwardingsRepository = parcelforwardingsRepository;
        this.hashGenerator = hashGenerator;
    }
    async execute({ name, initials, email, password, }) {
        const parcelforwardingWithSameEmail = await this.parcelforwardingsRepository.findByEmail(email);
        if (parcelforwardingWithSameEmail) {
            return (0, either_1.left)(new user_already_exists_error_1.UserAlreadyExistsError(email));
        }
        const hashedPassword = await this.hashGenerator.hash(password);
        const parcelforwarding = parcel_forwarding_1.ParcelForwarding.create({
            name,
            initials,
            email,
            password: hashedPassword,
        });
        await this.parcelforwardingsRepository.create(parcelforwarding);
        return (0, either_1.right)({
            parcelforwarding,
        });
    }
};
exports.RegisterParcelForwardingUseCase = RegisterParcelForwardingUseCase;
exports.RegisterParcelForwardingUseCase = RegisterParcelForwardingUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [parcel_forwardings_repository_1.ParcelForwardingsRepository,
        hash_generator_1.HashGenerator])
], RegisterParcelForwardingUseCase);
//# sourceMappingURL=register-parcel-forwarding.js.map