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
exports.EditDeclarationModelUseCase = void 0;
const either_1 = require("../../../../core/either");
const declaration_model_repository_1 = require("../repositories/declaration-model-repository");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const not_allowed_error_1 = require("../../../../core/errors/errors/not-allowed-error");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const declaration_model_item_1 = require("../../enterprise/entities/declaration-model-item");
const declaration_model_1 = require("../../enterprise/entities/declaration-model");
const declaration_model_item_repository_1 = require("../repositories/declaration-model-item-repository");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const common_1 = require("@nestjs/common");
let EditDeclarationModelUseCase = class EditDeclarationModelUseCase {
    declarationModelRepository;
    declarationModelItemsRepository;
    constructor(declarationModelRepository, declarationModelItemsRepository) {
        this.declarationModelRepository = declarationModelRepository;
        this.declarationModelItemsRepository = declarationModelItemsRepository;
    }
    async execute({ declarationModelId, customerId, title, items, }) {
        const currentDeclarationModel = await this.declarationModelRepository.findById(declarationModelId);
        if (!currentDeclarationModel) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError('DeclarationModel not found'));
        }
        if (currentDeclarationModel.customerId.toString() !== customerId) {
            return (0, either_1.left)(new not_allowed_error_1.NotAllowedError('You are not allowed to edit this DeclarationModel'));
        }
        const currentDeclarationModelItems = await this.declarationModelItemsRepository.findManyByDeclarationModelId(declarationModelId);
        if (!currentDeclarationModelItems) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError('DeclarationModelItems not found'));
        }
        const customDeclarationItemsList = new declaration_model_list_1.DeclarationModelList(currentDeclarationModelItems);
        const declarationModelItems = items.map((item) => {
            return declaration_model_item_1.DeclarationModelItem.create({
                declarationModelId: new unique_entity_id_1.UniqueEntityID(declarationModelId),
                description: item.description,
                value: item.value,
                quantity: item.quantity,
            }, new unique_entity_id_1.UniqueEntityID(item.id));
        });
        customDeclarationItemsList.update(declarationModelItems);
        const declarationModel = declaration_model_1.DeclarationModel.create({
            customerId: new unique_entity_id_1.UniqueEntityID(customerId),
            title,
        }, new unique_entity_id_1.UniqueEntityID(declarationModelId));
        declarationModel.items = customDeclarationItemsList;
        await this.declarationModelRepository.save(declarationModel);
        return (0, either_1.right)({
            declarationModel,
        });
    }
};
exports.EditDeclarationModelUseCase = EditDeclarationModelUseCase;
exports.EditDeclarationModelUseCase = EditDeclarationModelUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [declaration_model_repository_1.DeclarationModelRepository,
        declaration_model_item_repository_1.DeclarationModelItemsRepository])
], EditDeclarationModelUseCase);
//# sourceMappingURL=edit-declaration-model.js.map