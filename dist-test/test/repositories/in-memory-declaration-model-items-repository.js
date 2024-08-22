"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDeclarationModelItemsRepository = void 0;
class InMemoryDeclarationModelItemsRepository {
    items = [];
    async findManyByDeclarationModelId(declarationModelId) {
        const declarationModelItems = this.items.filter((item) => item.declarationModelId?.toString() === declarationModelId);
        return declarationModelItems;
    }
    async deleteMany(declarationModelItems) {
        const newDeclarationModelItems = this.items.filter((item) => {
            return !declarationModelItems.some((declarationItem) => declarationItem.equals(item));
        });
        this.items = newDeclarationModelItems;
    }
    async deleteManyByDeclarationModelId(declarationModelId) {
        const declarationModelItems = this.items.filter((item) => item.declarationModelId?.toString() !== declarationModelId);
        this.items = declarationModelItems;
    }
    async createMany(declarationModelItem) {
        this.items.push(...declarationModelItem);
    }
}
exports.InMemoryDeclarationModelItemsRepository = InMemoryDeclarationModelItemsRepository;
//# sourceMappingURL=in-memory-declaration-model-items-repository.js.map