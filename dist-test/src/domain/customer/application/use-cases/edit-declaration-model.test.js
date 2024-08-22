"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const in_memory_declaration_model_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-repository");
const in_memory_declaration_model_items_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-items-repository");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const edit_declaration_model_1 = require("./edit-declaration-model");
const make_declaration_model_item_1 = require("../../../../../test/factories/make-declaration-model-item");
const make_declaration_model_1 = require("../../../../../test/factories/make-declaration-model");
let inMemoryDeclarationModelItemsRepository;
let inMemoryDeclarationModelsRepository;
let sut;
let declarationModelItems;
let declarationModel;
describe('Edit Customs Declaration', () => {
    beforeEach(async () => {
        inMemoryDeclarationModelItemsRepository =
            new in_memory_declaration_model_items_repository_1.InMemoryDeclarationModelItemsRepository();
        inMemoryDeclarationModelsRepository =
            new in_memory_declaration_model_repository_1.InMemoryDeclarationModelsRepository(inMemoryDeclarationModelItemsRepository);
        sut = new edit_declaration_model_1.EditDeclarationModelUseCase(inMemoryDeclarationModelsRepository, inMemoryDeclarationModelItemsRepository);
        declarationModel = (0, make_declaration_model_1.makeDeclarationModel)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        declarationModelItems = [
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
    });
    it('should be able to edit a customs declaration when all declaration items with the same id change their props', async () => {
        const result = await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: declarationModel.customerId.toString(),
            title: declarationModel.title,
            items: declarationModelItems.map((item, i) => ({
                declarationModelId: declarationModel.id.toString(),
                description: `New description ${i + 1}`,
                value: 100,
                quantity: 10,
                id: item.id.toString(),
            })),
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(3);
        expect(inMemoryDeclarationModelItemsRepository.items).toEqual([
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 1',
                    value: 100,
                    quantity: 10,
                },
            }),
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 2',
                    value: 100,
                    quantity: 10,
                },
            }),
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 3',
                    value: 100,
                    quantity: 10,
                },
            }),
        ]);
    });
    it('should be able to edit a customs declaration when remove one declaration item', async () => {
        const result = await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: declarationModel.customerId.toString(),
            title: declarationModel.title,
            items: declarationModelItems.slice(0, -1).map((item, i) => ({
                id: item.id.toString(),
                declarationModelId: declarationModel.id.toString(),
                description: `New description ${i + 1}`,
                value: 100,
                quantity: 10,
            })),
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(2);
        expect(inMemoryDeclarationModelItemsRepository.items).toEqual([
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 1',
                    value: 100,
                    quantity: 10,
                },
            }),
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 2',
                    value: 100,
                    quantity: 10,
                },
            }),
        ]);
    });
    it('should be able to edit a customs declaration when add more items', async () => {
        declarationModelItems.push((0, make_declaration_model_item_1.makeDeclarationModelItem)({
            declarationModelId: declarationModel.id,
        }));
        const result = await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: declarationModel.customerId.toString(),
            title: declarationModel.title,
            items: declarationModelItems.map((item, i) => ({
                id: item.id.toString(),
                declarationModelId: declarationModel.id.toString(),
                description: `New description ${i + 1}`,
                value: 100,
                quantity: 10,
            })),
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(4);
        expect(inMemoryDeclarationModelItemsRepository.items).toEqual([
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 1',
                    value: 100,
                    quantity: 10,
                },
            }),
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 2',
                    value: 100,
                    quantity: 10,
                },
            }),
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 3',
                    value: 100,
                    quantity: 10,
                },
            }),
            expect.objectContaining({
                props: {
                    declarationModelId: declarationModel.id,
                    description: 'New description 4',
                    value: 100,
                    quantity: 10,
                },
            }),
        ]);
    });
    it('should be able to edit only the customs declaration title', async () => {
        const result = await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: declarationModel.customerId.toString(),
            title: 'My new title',
            items: declarationModelItems.map((item) => ({
                id: item.id.toString(),
                declarationModelId: declarationModel.id.toString(),
                description: item.description,
                value: item.value,
                quantity: item.quantity,
            })),
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(3);
        expect(inMemoryDeclarationModelsRepository.items[0].title).toBe('My new title');
        expect(inMemoryDeclarationModelItemsRepository.items).toEqual(declarationModelItems);
    });
    it('should not be able to edit a customs declaration from another user', async () => {
        const result = await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: 'another-customer-id',
            title: 'My new title',
            items: declarationModelItems.map((item) => ({
                id: item.id.toString(),
                declarationModelId: declarationModel.id.toString(),
                description: item.description,
                value: item.value,
                quantity: item.quantity,
            })),
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=edit-declaration-model.test.js.map