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
exports.CreateCheckInController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const zod_1 = require("zod");
const check_in_1 = require("../../../../domain/parcel-forwarding/application/use-cases/check-in");
const createCheckInBodySchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid(),
    details: zod_1.z.string().max(100).optional().default(''),
    weight: zod_1.z.number().max(453139).optional().default(0),
    attachmentsIds: zod_1.z.array(zod_1.z.string().uuid()),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(createCheckInBodySchema);
let CreateCheckInController = class CreateCheckInController {
    checkInUseCase;
    constructor(checkInUseCase) {
        this.checkInUseCase = checkInUseCase;
    }
    async handle(body, user) {
        const { customerId, details, weight, attachmentsIds } = body;
        const userId = user.sub;
        const result = await this.checkInUseCase.execute({
            customerId,
            details,
            weight,
            status: 1,
            parcelForwardingId: userId,
            attachmentsIds,
        });
        if (result.isLeft()) {
            throw new common_1.BadRequestException();
        }
    }
};
exports.CreateCheckInController = CreateCheckInController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreateCheckInController.prototype, "handle", null);
exports.CreateCheckInController = CreateCheckInController = __decorate([
    (0, common_1.Controller)('/check-in'),
    __metadata("design:paramtypes", [check_in_1.CheckInUseCase])
], CreateCheckInController);
//# sourceMappingURL=create-check-in.controller.js.map