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
exports.DeleteDeclarationModelUseCase = void 0;
const either_1 = require("../../../../core/either");
const declaration_model_repository_1 = require("../repositories/declaration-model-repository");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const common_1 = require("@nestjs/common");
let DeleteDeclarationModelUseCase = class DeleteDeclarationModelUseCase {
    declarationModelRepository;
    constructor(declarationModelRepository) {
        this.declarationModelRepository = declarationModelRepository;
    }
    async execute({ customerId, declarationModelId, }) {
        const declarationModel = await this.declarationModelRepository.findById(declarationModelId);
        if (!declarationModel) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError('DeclarationModel not found'));
        }
        if (declarationModel.customerId.toString() !== customerId) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('You are not allowed to delete this DeclarationModel'));
        }
        await this.declarationModelRepository.delete(declarationModel);
        return (0, either_1.right)({
            declarationModel,
        });
    }
};
exports.DeleteDeclarationModelUseCase = DeleteDeclarationModelUseCase;
exports.DeleteDeclarationModelUseCase = DeleteDeclarationModelUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [declaration_model_repository_1.DeclarationModelRepository])
], DeleteDeclarationModelUseCase);
//# sourceMappingURL=delete-declaration-model.js.map