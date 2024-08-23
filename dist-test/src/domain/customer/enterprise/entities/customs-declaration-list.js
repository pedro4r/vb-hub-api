"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomsDeclarationList = void 0;
const watched_list_1 = require("../../../../core/entities/watched-list");
class CustomsDeclarationList extends watched_list_1.WatchedList {
    compareItems(a, b) {
        return (a.id.equals(b.id) &&
            a.packageId.equals(b.packageId) &&
            a.description === b.description &&
            a.quantity === b.quantity &&
            a.value === b.value);
    }
}
exports.CustomsDeclarationList = CustomsDeclarationList;
//# sourceMappingURL=customs-declaration-list.js.map