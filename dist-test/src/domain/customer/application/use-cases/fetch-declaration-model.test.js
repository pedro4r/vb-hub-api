"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_declaration_model_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-repository");
const fetch_declaration_model_1 = require("./fetch-declaration-model");
const in_memory_declaration_model_items_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-items-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const make_declaration_model_1 = require("../../../../../test/factories/make-declaration-model");
const make_declaration_model_item_1 = require("../../../../../test/factories/make-declaration-model-item");
let inMemoryDeclarationModelsItemsRepository;
let inMemoryDeclarationModelsRepository;
let sut;
describe('Fetch Customs Declarations', () => {
    beforeEach(async () => {
        inMemoryDeclarationModelsItemsRepository =
            new in_memory_declaration_model_items_repository_1.InMemoryDeclarationModelItemsRepository();
        inMemoryDeclarationModelsRepository =
            new in_memory_declaration_model_repository_1.InMemoryDeclarationModelsRepository(inMemoryDeclarationModelsItemsRepository);
        sut = new fetch_declaration_model_1.FetchDeclarationModelsUseCase(inMemoryDeclarationModelsRepository, inMemoryDeclarationModelsItemsRepository);
        await Promise.all(new Array(7).fill(null).map(async (_, i) => {
            const declarationModel = (0, make_declaration_model_1.makeDeclarationModel)({
                customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
                title: `Customs Declaration ${i + 1}`,
            });
            const declarationModelsItems = [
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
            declarationModel.items = new declaration_model_list_1.DeclarationModelList(declarationModelsItems);
            return inMemoryDeclarationModelsRepository.create(declarationModel);
        }));
    });
    it('should be able to fetch customs declarations', async () => {
        const result = await sut.execute({
            customerId: 'customer-1',
        });
        expect(result.isRight()).toBeTruthy();
        expect(result.value
            .declarationModels.length).toEqual(7);
        expect(result.value
            .declarationModels[0].items.currentItems.length).toEqual(3);
        expect(inMemoryDeclarationModelsRepository.items.length).toBe(7);
        expect(inMemoryDeclarationModelsItemsRepository.items.length).toBe(21);
    });
});
//# sourceMappingURL=fetch-declaration-model.test.js.map