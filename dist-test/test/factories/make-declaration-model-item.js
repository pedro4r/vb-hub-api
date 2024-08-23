"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeclarationModelItem = makeDeclarationModelItem;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const declaration_model_item_1 = require("../../src/domain/customer/enterprise/entities/declaration-model-item");
const faker_1 = require("@faker-js/faker");
function makeDeclarationModelItem(override = {}, id) {
    const declarationModelItem = declaration_model_item_1.DeclarationModelItem.create({
        declarationModelId: new unique_entity_id_1.UniqueEntityID(),
        description: faker_1.faker.lorem.words(3),
        value: faker_1.faker.number.int({ min: 1, max: 1000 }),
        quantity: faker_1.faker.number.int({ min: 1, max: 100 }),
        ...override,
    }, id);
    return declarationModelItem;
}
//# sourceMappingURL=make-declaration-model-item.js.map