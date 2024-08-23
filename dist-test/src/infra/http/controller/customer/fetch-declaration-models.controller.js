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
exports.FetchDeclarationModelsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../../auth/current-user-decorator");
const fetch_declaration_model_1 = require("../../../../domain/customer/application/use-cases/fetch-declaration-model");
const declaration_model_presenter_1 = require("../../presenters/declaration-model-presenter");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
let FetchDeclarationModelsController = class FetchDeclarationModelsController {
    fetchDeclarationModelsUseCase;
    constructor(fetchDeclarationModelsUseCase) {
        this.fetchDeclarationModelsUseCase = fetchDeclarationModelsUseCase;
    }
    async handle(user) {
        const userId = user.sub;
        const result = await this.fetchDeclarationModelsUseCase.execute({
            customerId: userId,
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
        const declarationModels = result.value.declarationModels;
        return {
            declarationModels: declarationModels.map(declaration_model_presenter_1.DeclarationModelPresenter.toHTTP),
        };
    }
};
exports.FetchDeclarationModelsController = FetchDeclarationModelsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FetchDeclarationModelsController.prototype, "handle", null);
exports.FetchDeclarationModelsController = FetchDeclarationModelsController = __decorate([
    (0, common_1.Controller)('/declaration-model'),
    __metadata("design:paramtypes", [fetch_declaration_model_1.FetchDeclarationModelsUseCase])
], FetchDeclarationModelsController);
//# sourceMappingURL=fetch-declaration-models.controller.js.map