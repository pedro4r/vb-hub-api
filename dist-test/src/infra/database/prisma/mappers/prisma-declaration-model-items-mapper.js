"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDeclarationModelItemsMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const declaration_model_item_1 = require("../../../../domain/customer/enterprise/entities/declaration-model-item");
class PrismaDeclarationModelItemsMapper {
    static toDomain(raw) {
        return declaration_model_item_1.DeclarationModelItem.create({
            declarationModelId: new unique_entity_id_1.UniqueEntityID(raw.declarationModelId),
            description: raw.description,
            value: raw.value,
            quantity: raw.quantity,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(declarationModelItem, index) {
        return {
            id: declarationModelItem.id.toString(),
            declarationModelId: declarationModelItem.declarationModelId.toString(),
            description: declarationModelItem.description,
            value: declarationModelItem.value,
            quantity: declarationModelItem.quantity,
            createdAt: new Date(Date.now() + index * 1000),
        };
    }
}
exports.PrismaDeclarationModelItemsMapper = PrismaDeclarationModelItemsMapper;
//# sourceMappingURL=prisma-declaration-model-items-mapper.js.map