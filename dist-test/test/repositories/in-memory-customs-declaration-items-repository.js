"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCustomsDeclarationItemsRepository = void 0;
class InMemoryCustomsDeclarationItemsRepository {
    items = [];
    async findManyByPackageId(packageId) {
        const customsDeclarationItems = this.items.filter((item) => item.packageId?.toString() === packageId);
        return customsDeclarationItems;
    }
    async deleteMany(customsDeclarationItems) {
        const declarationItems = this.items.filter((declarationItem) => {
            return !customsDeclarationItems.some((item) => item.equals(declarationItem));
        });
        this.items = declarationItems;
    }
    async createMany(customsDeclarationItems) {
        this.items.push(...customsDeclarationItems);
    }
}
exports.InMemoryCustomsDeclarationItemsRepository = InMemoryCustomsDeclarationItemsRepository;
//# sourceMappingURL=in-memory-customs-declaration-items-repository.js.map