"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCustomsDeclarationItems = makeCustomsDeclarationItems;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const make_declaration_model_item_1 = require("./make-declaration-model-item");
const customs_declaration_item_1 = require("../../src/domain/customer/enterprise/entities/customs-declaration-item");
function makeCustomsDeclarationItems(packageId) {
    const declarationModelItems = [
        (0, make_declaration_model_item_1.makeDeclarationModelItem)({
            declarationModelId: new unique_entity_id_1.UniqueEntityID('declaration-model-id'),
        }),
        (0, make_declaration_model_item_1.makeDeclarationModelItem)({
            declarationModelId: new unique_entity_id_1.UniqueEntityID('declaration-model-id'),
        }),
        (0, make_declaration_model_item_1.makeDeclarationModelItem)({
            declarationModelId: new unique_entity_id_1.UniqueEntityID('declaration-model-id'),
        }),
    ];
    const customsDeclarationItems = declarationModelItems.map((declarationModelItem) => {
        return customs_declaration_item_1.CustomsDeclarationItem.create({
            packageId,
            description: declarationModelItem.description,
            value: declarationModelItem.value,
            quantity: declarationModelItem.quantity,
        });
    });
    return customsDeclarationItems;
}
//# sourceMappingURL=make-customs-declaration-items.js.map