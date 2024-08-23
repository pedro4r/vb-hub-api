"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeclarationModel = makeDeclarationModel;
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const declaration_model_1 = require("../../src/domain/customer/enterprise/entities/declaration-model");
const faker_1 = require("@faker-js/faker");
function makeDeclarationModel(override = {}, id) {
    const declarationModel = declaration_model_1.DeclarationModel.create({
        customerId: new unique_entity_id_1.UniqueEntityID(),
        title: faker_1.faker.lorem.words(3),
        ...override,
    }, id);
    return declarationModel;
}
//# sourceMappingURL=make-declaration-model.js.map