"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationModelList = void 0;
const watched_list_1 = require("../../../../core/entities/watched-list");
class DeclarationModelList extends watched_list_1.WatchedList {
    compareItems(a, b) {
        return (a.id.equals(b.id) &&
            a.description === b.description &&
            a.quantity === b.quantity &&
            a.value === b.value);
    }
}
exports.DeclarationModelList = DeclarationModelList;
//# sourceMappingURL=declaration-model-list.js.map