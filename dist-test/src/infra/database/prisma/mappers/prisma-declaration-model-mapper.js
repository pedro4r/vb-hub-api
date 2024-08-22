"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDeclarationModelMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const declaration_model_1 = require("../../../../domain/customer/enterprise/entities/declaration-model");
class PrismaDeclarationModelMapper {
    static toDomain(raw) {
        return declaration_model_1.DeclarationModel.create({
            title: raw.title,
            customerId: new unique_entity_id_1.UniqueEntityID(raw.customerId),
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(declarationModel) {
        return {
            id: declarationModel.id.toString(),
            title: declarationModel.title,
            customerId: declarationModel.customerId.toString(),
        };
    }
}
exports.PrismaDeclarationModelMapper = PrismaDeclarationModelMapper;
//# sourceMappingURL=prisma-declaration-model-mapper.js.map