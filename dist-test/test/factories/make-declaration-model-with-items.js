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
exports.DeclarationModelWithItemsFactory = void 0;
exports.makeDeclarationModelWithItems = makeDeclarationModelWithItems;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const declaration_model_1 = require("../../src/domain/customer/enterprise/entities/declaration-model");
const faker_1 = require("@faker-js/faker");
const make_declaration_model_item_1 = require("./make-declaration-model-item");
const declaration_model_list_1 = require("../../src/domain/customer/enterprise/entities/declaration-model-list");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
const prisma_declaration_model_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-declaration-model-mapper");
const prisma_declaration_model_items_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-declaration-model-items-mapper");
function makeDeclarationModelWithItems(override = {}, id) {
    const declarationModel = declaration_model_1.DeclarationModel.create({
        customerId: new unique_entity_id_1.UniqueEntityID(),
        title: faker_1.faker.lorem.words(3),
        ...override,
    }, id);
    const declarationModelsItems = [
        (0, make_declaration_model_item_1.makeDeclarationModelItem)({
            description: 'Item 1',
            declarationModelId: declarationModel.id,
        }),
        (0, make_declaration_model_item_1.makeDeclarationModelItem)({
            description: 'Item 2',
            declarationModelId: declarationModel.id,
        }),
        (0, make_declaration_model_item_1.makeDeclarationModelItem)({
            description: 'Item 3',
            declarationModelId: declarationModel.id,
        }),
    ];
    declarationModel.items = new declaration_model_list_1.DeclarationModelList(declarationModelsItems);
    return declarationModel;
}
let DeclarationModelWithItemsFactory = class DeclarationModelWithItemsFactory {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaDeclarationModel(data = {}) {
        const declarationModel = makeDeclarationModelWithItems(data);
        await this.prisma.declarationModel.create({
            data: prisma_declaration_model_mapper_1.PrismaDeclarationModelMapper.toPrisma(declarationModel),
        });
        const declarationModelItems = declarationModel.items.getItems();
        await this.prisma.declarationModelItem.createMany({
            data: declarationModelItems.map((item, index) => prisma_declaration_model_items_mapper_1.PrismaDeclarationModelItemsMapper.toPrisma(item, index)),
        });
        return declarationModel;
    }
};
exports.DeclarationModelWithItemsFactory = DeclarationModelWithItemsFactory;
exports.DeclarationModelWithItemsFactory = DeclarationModelWithItemsFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeclarationModelWithItemsFactory);
//# sourceMappingURL=make-declaration-model-with-items.js.map