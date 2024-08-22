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
exports.EditDeclarationModelController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const edit_declaration_model_1 = require("../../../../domain/customer/application/use-cases/edit-declaration-model");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const editDeclarationModelBodySchema = zod_1.z.object({
    title: zod_1.z.string(),
    declarationModelItems: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        declarationModelId: zod_1.z.string(),
        description: zod_1.z.string(),
        value: zod_1.z.number(),
        quantity: zod_1.z.number(),
    })),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(editDeclarationModelBodySchema);
let EditDeclarationModelController = class EditDeclarationModelController {
    editDeclarationModelUseCase;
    constructor(editDeclarationModelUseCase) {
        this.editDeclarationModelUseCase = editDeclarationModelUseCase;
    }
    async handle(body, user, declarationModelId) {
        const { title, declarationModelItems } = body;
        const userId = user.sub;
        const result = await this.editDeclarationModelUseCase.execute({
            customerId: userId,
            declarationModelId,
            title,
            items: declarationModelItems.map((item) => ({
                id: item.id,
                declarationModelId: item.declarationModelId,
                description: item.description,
                value: item.value,
                quantity: item.quantity,
            })),
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
exports.EditDeclarationModelController = EditDeclarationModelController;
__decorate([
    (0, common_1.Put)(),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], EditDeclarationModelController.prototype, "handle", null);
exports.EditDeclarationModelController = EditDeclarationModelController = __decorate([
    (0, common_1.Controller)('/declaration-model/:id'),
    __metadata("design:paramtypes", [edit_declaration_model_1.EditDeclarationModelUseCase])
], EditDeclarationModelController);
//# sourceMappingURL=edit-declaration-model.controller.js.map