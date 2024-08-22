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
exports.CreateDeclarationModelUseCase = void 0;
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const declaration_model_repository_1 = require("../repositories/declaration-model-repository");
const declaration_model_item_1 = require("../../enterprise/entities/declaration-model-item");
const declaration_model_1 = require("../../enterprise/entities/declaration-model");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const common_1 = require("@nestjs/common");
let CreateDeclarationModelUseCase = class CreateDeclarationModelUseCase {
    declarationModelRepository;
    constructor(declarationModelRepository) {
        this.declarationModelRepository = declarationModelRepository;
    }
    async execute({ customerId, title, declarationModelItems, }) {
        const declarationModel = declaration_model_1.DeclarationModel.create({
            customerId: new unique_entity_id_1.UniqueEntityID(customerId),
            title,
        });
        const items = declarationModelItems.map((item) => {
            return declaration_model_item_1.DeclarationModelItem.create({
                declarationModelId: declarationModel.id,
                description: item.description,
                value: item.value,
                quantity: item.quantity,
            });
        });
        declarationModel.items = new declaration_model_list_1.DeclarationModelList(items);
        await this.declarationModelRepository.create(declarationModel);
        return (0, either_1.right)({
            declarationModel,
        });
    }
};
exports.CreateDeclarationModelUseCase = CreateDeclarationModelUseCase;
exports.CreateDeclarationModelUseCase = CreateDeclarationModelUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [declaration_model_repository_1.DeclarationModelRepository])
], CreateDeclarationModelUseCase);
//# sourceMappingURL=create-declaration-model.js.map