"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_declaration_model_items_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-items-repository");
const in_memory_declaration_model_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const delete_declaration_model_1 = require("./delete-declaration-model");
const make_declaration_model_1 = require("../../../../../test/factories/make-declaration-model");
const make_declaration_model_item_1 = require("../../../../../test/factories/make-declaration-model-item");
let inMemoryDeclarationModelItemsRepository;
let inMemoryDeclarationModelsRepository;
let sut;
describe('Delete Customs Declaration', () => {
    beforeEach(() => {
        inMemoryDeclarationModelItemsRepository =
            new in_memory_declaration_model_items_repository_1.InMemoryDeclarationModelItemsRepository();
        inMemoryDeclarationModelsRepository =
            new in_memory_declaration_model_repository_1.InMemoryDeclarationModelsRepository(inMemoryDeclarationModelItemsRepository);
        sut = new delete_declaration_model_1.DeleteDeclarationModelUseCase(inMemoryDeclarationModelsRepository);
    });
    it('should be able to delete a customs declaration', async () => {
        const declarationModel = (0, make_declaration_model_1.makeDeclarationModel)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        const declarationModelItems = [
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
        ];
        declarationModel.items = new declaration_model_list_1.DeclarationModelList(declarationModelItems);
        await inMemoryDeclarationModelsRepository.create(declarationModel);
        expect(inMemoryDeclarationModelsRepository.items.length === 1).toBeTruthy();
        expect(inMemoryDeclarationModelItemsRepository.items.length === 3).toBeTruthy();
        await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: declarationModel.customerId.toString(),
        });
        expect(inMemoryDeclarationModelsRepository.items.length === 0).toBeTruthy();
        expect(inMemoryDeclarationModelItemsRepository.items.length === 0).toBeTruthy();
    });
    it('should not be able to delete a customs declaration with another user id', async () => {
        const declarationModel = (0, make_declaration_model_1.makeDeclarationModel)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        const declarationModelItems = [
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
        ];
        declarationModel.items = new declaration_model_list_1.DeclarationModelList(declarationModelItems);
        await inMemoryDeclarationModelsRepository.create(declarationModel);
        const result = await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: 'customer-2',
        });
        expect(result.isLeft()).toBeTruthy();
    });
    it('should not be able to delete a customs declaration with another customs declaration id', async () => {
        const declarationModel = (0, make_declaration_model_1.makeDeclarationModel)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        const declarationModelItems = [
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
            (0, make_declaration_model_item_1.makeDeclarationModelItem)({
                declarationModelId: declarationModel.id,
            }),
        ];
        declarationModel.items = new declaration_model_list_1.DeclarationModelList(declarationModelItems);
        await inMemoryDeclarationModelsRepository.create(declarationModel);
        const result = await sut.execute({
            declarationModelId: 'another-customs-declaration-id',
            customerId: declarationModel.customerId.toString(),
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=delete-declaration-model.test.js.map