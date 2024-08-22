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
exports.FetchDeclarationModelsUseCase = void 0;
const either_1 = require("../../../../core/either");
const declaration_model_repository_1 = require("../repositories/declaration-model-repository");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const declaration_model_item_repository_1 = require("../repositories/declaration-model-item-repository");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const common_1 = require("@nestjs/common");
let FetchDeclarationModelsUseCase = class FetchDeclarationModelsUseCase {
    declarationModelRepository;
    declarationModelItemsRepository;
    constructor(declarationModelRepository, declarationModelItemsRepository) {
        this.declarationModelRepository = declarationModelRepository;
        this.declarationModelItemsRepository = declarationModelItemsRepository;
    }
    async execute({ customerId, }) {
        const declarations = await this.declarationModelRepository.findManyByCustomerId(customerId);
        if (!declarations) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError('No declaration models found.'));
        }
        if (declarations[0].customerId.toString() !== customerId) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('You are not allowed to access this resource.'));
        }
        const declarationModels = await Promise.all(declarations.map(async (declarationModel) => {
            const items = await this.declarationModelItemsRepository.findManyByDeclarationModelId(declarationModel.id.toString());
            if (items) {
                declarationModel.items = new declaration_model_list_1.DeclarationModelList(items);
            }
            return declarationModel;
        }));
        return (0, either_1.right)({
            declarationModels,
        });
    }
};
exports.FetchDeclarationModelsUseCase = FetchDeclarationModelsUseCase;
exports.FetchDeclarationModelsUseCase = FetchDeclarationModelsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [declaration_model_repository_1.DeclarationModelRepository,
        declaration_model_item_repository_1.DeclarationModelItemsRepository])
], FetchDeclarationModelsUseCase);
//# sourceMappingURL=fetch-declaration-model.js.map