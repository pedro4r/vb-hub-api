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
exports.CreateDeclarationModelController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../../pipe/zod-validation-pipe");
const zod_1 = require("zod");
const create_declaration_model_1 = require("../../../../domain/customer/application/use-cases/create-declaration-model");
const CreateDeclarationModelBodySchema = zod_1.z.object({
    title: zod_1.z.string(),
    declarationModelItems: zod_1.z.array(zod_1.z.object({
        description: zod_1.z.string(),
        value: zod_1.z.number(),
        quantity: zod_1.z.number(),
    })),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(CreateDeclarationModelBodySchema);
let CreateDeclarationModelController = class CreateDeclarationModelController {
    createDeclarationModelUseCase;
    constructor(createDeclarationModelUseCase) {
        this.createDeclarationModelUseCase = createDeclarationModelUseCase;
    }
    async handle(body, user) {
        const { title, declarationModelItems } = body;
        const userId = user.sub;
        const result = await this.createDeclarationModelUseCase.execute({
            customerId: userId,
            title,
            declarationModelItems,
        });
        if (result.isLeft()) {
            throw new common_1.BadRequestException();
        }
    }
};
exports.CreateDeclarationModelController = CreateDeclarationModelController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreateDeclarationModelController.prototype, "handle", null);
exports.CreateDeclarationModelController = CreateDeclarationModelController = __decorate([
    (0, common_1.Controller)('/declaration-model'),
    __metadata("design:paramtypes", [create_declaration_model_1.CreateDeclarationModelUseCase])
], CreateDeclarationModelController);
//# sourceMappingURL=create-declaration-model.controller.js.map