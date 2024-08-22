"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDeclarationModelsRepository = void 0;
class InMemoryDeclarationModelsRepository {
    declarationModelItemsRepository;
    items = [];
    constructor(declarationModelItemsRepository) {
        this.declarationModelItemsRepository = declarationModelItemsRepository;
    }
    async findManyByCustomerId(customerId) {
        const declarationModels = this.items.filter((item) => item.customerId.toString() === customerId);
        return declarationModels;
    }
    async delete(declarationModel) {
        const itemIndex = this.items.findIndex((item) => item.id.equals(declarationModel.id));
        this.items.splice(itemIndex, 1);
        await this.declarationModelItemsRepository.deleteManyByDeclarationModelId(declarationModel.id.toString());
    }
    async findById(declarationModelId) {
        const declarationModel = this.items.find((item) => item.id.toString() === declarationModelId);
        if (!declarationModel) {
            return null;
        }
        return declarationModel;
    }
    async save(declarationModel) {
        const itemIndex = this.items.findIndex((item) => item.id.equals(declarationModel.id));
        this.items[itemIndex] = declarationModel;
        await this.declarationModelItemsRepository.createMany(declarationModel.items.getNewItems());
        await this.declarationModelItemsRepository.deleteMany(declarationModel.items.getRemovedItems());
    }
    async create(declarationModel) {
        this.items.push(declarationModel);
        await this.declarationModelItemsRepository.createMany(declarationModel.items.getItems());
    }
}
exports.InMemoryDeclarationModelsRepository = InMemoryDeclarationModelsRepository;
//# sourceMappingURL=in-memory-declaration-model-repository.js.map