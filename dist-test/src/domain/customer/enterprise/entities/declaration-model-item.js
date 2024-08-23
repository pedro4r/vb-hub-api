"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationModelItem = void 0;
const entity_1 = require("../../../../core/entities/entity");
class DeclarationModelItem extends entity_1.Entity {
    get declarationModelId() {
        return this.props.declarationModelId;
    }
    set declarationModelId(id) {
        this.props.declarationModelId = id;
    }
    get description() {
        return this.props.description;
    }
    get value() {
        return this.props.value;
    }
    get quantity() {
        return this.props.quantity;
    }
    static create(props, id) {
        const declarationModelItem = new DeclarationModelItem(props, id);
        return declarationModelItem;
    }
}
exports.DeclarationModelItem = DeclarationModelItem;
//# sourceMappingURL=declaration-model-item.js.map