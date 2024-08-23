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
exports.EditCheckInController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const edit_check_in_1 = require("../../../../domain/parcel-forwarding/application/use-cases/edit-check-in");
const editCheckInBodySchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid(),
    details: zod_1.z.string().optional().default(''),
    status: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1)),
    weight: zod_1.z
        .string()
        .optional()
        .default('0')
        .transform(Number)
        .pipe(zod_1.z.number().min(0)),
    attachmentsIds: zod_1.z.array(zod_1.z.string().uuid()),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(editCheckInBodySchema);
let EditCheckInController = class EditCheckInController {
    editCheckInUseCase;
    constructor(editCheckInUseCase) {
        this.editCheckInUseCase = editCheckInUseCase;
    }
    async handle(body, user, checkInId) {
        const { customerId, status, details, weight, attachmentsIds } = body;
        const userId = user.sub;
        const result = await this.editCheckInUseCase.execute({
            checkInId,
            parcelForwardingId: userId,
            customerId,
            details,
            weight,
            status,
            attachmentsIds,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case resource_not_found_error_1.ResourceNotFoundError:
                    throw new common_1.ConflictException(error.message);
                case not_allowed_error_1.NotAllowedError:
                    throw new common_1.ConflictException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
    }
};
exports.EditCheckInController = EditCheckInController;
__decorate([
    (0, common_1.Put)(),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], EditCheckInController.prototype, "handle", null);
exports.EditCheckInController = EditCheckInController = __decorate([
    (0, common_1.Controller)('/check-in/:id'),
    __metadata("design:paramtypes", [edit_check_in_1.EditCheckInUseCase])
], EditCheckInController);
//# sourceMappingURL=edit-check-in.controller.js.map