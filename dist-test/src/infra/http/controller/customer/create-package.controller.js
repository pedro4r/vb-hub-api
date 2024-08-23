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
exports.CreatePackageController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const zod_1 = require("zod");
const create_package_1 = require("../../../../domain/customer/application/use-cases/create-package");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const createPackageBodySchema = zod_1.z.object({
    parcelForwardingId: zod_1.z.string(),
    shippingAddressId: zod_1.z.string(),
    checkInsIds: zod_1.z.array(zod_1.z.string().uuid()),
    declarationModelId: zod_1.z.string().optional(),
    hasBattery: zod_1.z.boolean(),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(createPackageBodySchema);
let CreatePackageController = class CreatePackageController {
    createPackageUseCase;
    constructor(createPackageUseCase) {
        this.createPackageUseCase = createPackageUseCase;
    }
    async handle(body, user) {
        const { parcelForwardingId, shippingAddressId, checkInsIds, declarationModelId, hasBattery, } = body;
        const userId = user.sub;
        const result = await this.createPackageUseCase.execute({
            customerId: userId,
            parcelForwardingId,
            shippingAddressId,
            checkInsIds,
            declarationModelId,
            hasBattery,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case resource_not_found_error_1.ResourceNotFoundError:
                    throw new common_1.ConflictException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
    }
};
exports.CreatePackageController = CreatePackageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreatePackageController.prototype, "handle", null);
exports.CreatePackageController = CreatePackageController = __decorate([
    (0, common_1.Controller)('/package'),
    __metadata("design:paramtypes", [create_package_1.CreatePackageUseCase])
], CreatePackageController);
//# sourceMappingURL=create-package.controller.js.map