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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterParcelForwardingController = void 0;
const register_parcel_forwarding_1 = require("../../../../domain/parcel-forwarding/application/use-cases/register-parcel-forwarding");
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const account_already_exists_error_1 = require("../../../../domain/parcel-forwarding/application/use-cases/errors/account-already-exists-error");
const public_1 = require("../../../auth/public");
const createAccountBodySchema = zod_1.z.object({
    name: zod_1.z.string(),
    initials: zod_1.z.string().length(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
let RegisterParcelForwardingController = class RegisterParcelForwardingController {
    registerStudent;
    constructor(registerStudent) {
        this.registerStudent = registerStudent;
    }
    async handle(body) {
        const { name, initials, email, password } = body;
        const result = await this.registerStudent.execute({
            name,
            initials,
            email,
            password,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case account_already_exists_error_1.AccountAlreadyExistsError:
                    throw new common_1.ConflictException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
    }
};
exports.RegisterParcelForwardingController = RegisterParcelForwardingController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(createAccountBodySchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterParcelForwardingController.prototype, "handle", null);
exports.RegisterParcelForwardingController = RegisterParcelForwardingController = __decorate([
    (0, common_1.Controller)('/parcel-forwarding/register'),
    (0, public_1.Public)(),
    __metadata("design:paramtypes", [register_parcel_forwarding_1.RegisterParcelForwardingUseCase])
], RegisterParcelForwardingController);
//# sourceMappingURL=register-parcel-forwarding.controller.js.map