"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_declaration_model_items_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-items-repository");
const create_declaration_model_1 = require("./create-declaration-model");
const in_memory_declaration_model_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-repository");
let inMemoryDeclarationModelItemsRepository;
let inMemoryDeclarationModelsRepository;
let sut;
describe('Create Customs Declaration', () => {
    beforeEach(() => {
        inMemoryDeclarationModelItemsRepository =
            new in_memory_declaration_model_items_repository_1.InMemoryDeclarationModelItemsRepository();
        inMemoryDeclarationModelsRepository =
            new in_memory_declaration_model_repository_1.InMemoryDeclarationModelsRepository(inMemoryDeclarationModelItemsRepository);
        sut = new create_declaration_model_1.CreateDeclarationModelUseCase(inMemoryDeclarationModelsRepository);
    });
    it('should be able to create a customs declaration', async () => {
        const result = await sut.execute({
            customerId: 'customer-id',
            title: 'New customs declaration',
            declarationModelItems: [
                {
                    description: 'Item 1',
                    quantity: 1,
                    value: 100,
                },
                {
                    description: 'Item 2',
                    quantity: 2,
                    value: 200,
                },
            ],
        });
        const declarationModelId = result.value?.declarationModel.id;
        expect(result.isRight()).toBe(true);
        expect(inMemoryDeclarationModelsRepository.items[0]).toEqual(result.value?.declarationModel);
        expect(inMemoryDeclarationModelItemsRepository.items).toEqual([
            expect.objectContaining({
                description: 'Item 1',
                declarationModelId,
            }),
            expect.objectContaining({
                description: 'Item 2',
                declarationModelId,
            }),
        ]);
    });
});
//# sourceMappingURL=create-declaration-model.test.js.map