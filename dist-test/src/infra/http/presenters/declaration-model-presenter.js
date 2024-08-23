"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationModelPresenter = void 0;
class DeclarationModelPresenter {
    static toHTTP(declarationModel) {
        return {
            id: declarationModel.id.toString(),
            title: declarationModel.title,
            items: declarationModel.items.getItems(),
        };
    }
}
exports.DeclarationModelPresenter = DeclarationModelPresenter;
//# sourceMappingURL=declaration-model-presenter.js.map