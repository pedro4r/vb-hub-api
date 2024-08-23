"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationModel = void 0;
const entity_1 = require("../../../../core/entities/entity");
const declaration_model_list_1 = require("./declaration-model-list");
class DeclarationModel extends entity_1.Entity {
    get customerId() {
        return this.props.customerId;
    }
    get title() {
        return this.props.title;
    }
    set title(title) {
        this.props.title = title;
    }
    get items() {
        return this.props.items;
    }
    set items(items) {
        this.props.items = items;
    }
    static create(props, id) {
        const declarationModel = new DeclarationModel({
            ...props,
            items: new declaration_model_list_1.DeclarationModelList(),
        }, id);
        return declarationModel;
    }
}
exports.DeclarationModel = DeclarationModel;
//# sourceMappingURL=declaration-model.js.map