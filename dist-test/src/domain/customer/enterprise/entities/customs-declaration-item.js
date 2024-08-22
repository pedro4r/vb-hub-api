"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomsDeclarationItem = void 0;
const entity_1 = require("../../../../core/entities/entity");
class CustomsDeclarationItem extends entity_1.Entity {
    get packageId() {
        return this.props.packageId;
    }
    set packageId(id) {
        this.props.packageId = id;
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
        const customsDeclarationItem = new CustomsDeclarationItem(props, id);
        return customsDeclarationItem;
    }
}
exports.CustomsDeclarationItem = CustomsDeclarationItem;
//# sourceMappingURL=customs-declaration-item.js.map