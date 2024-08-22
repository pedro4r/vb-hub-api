"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_declaration_model_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-repository");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const in_memory_declaration_model_items_repository_1 = require("../../../../../test/repositories/in-memory-declaration-model-items-repository");
const declaration_model_list_1 = require("../../enterprise/entities/declaration-model-list");
const get_declaration_model_1 = require("./get-declaration-model");
const make_declaration_model_item_1 = require("../../../../../test/factories/make-declaration-model-item");
const make_declaration_model_1 = require("../../../../../test/factories/make-declaration-model");
let inMemoryDeclarationModelItemsRepository;
let inMemoryDeclarationModelsRepository;
let sut;
describe('Get Customs Declaration', () => {
    beforeEach(() => {
        inMemoryDeclarationModelItemsRepository =
            new in_memory_declaration_model_items_repository_1.InMemoryDeclarationModelItemsRepository();
        inMemoryDeclarationModelsRepository =
            new in_memory_declaration_model_repository_1.InMemoryDeclarationModelsRepository(inMemoryDeclarationModelItemsRepository);
        sut = new get_declaration_model_1.GetDeclarationModelUseCase(inMemoryDeclarationModelsRepository, inMemoryDeclarationModelItemsRepository);
    });
    it('should be able to get a customs declaration', async () => {
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
        const anotherDeclarationModel = (0, make_declaration_model_1.makeDeclarationModel)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-2'),
        });
        await inMemoryDeclarationModelsRepository.create(anotherDeclarationModel);
        const result = await sut.execute({
            declarationModelId: declarationModel.id.toString(),
            customerId: declarationModel.customerId.toString(),
        });
        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual({
            declarationModel,
        });
        expect(result.value).toEqual({
            declarationModel: expect.objectContaining({
                customerId: declarationModel.customerId,
            }),
        });
    });
    it('should not be able to get a customs declaration', async () => {
        const declarationModel1 = (0, make_declaration_model_1.makeDeclarationModel)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-1'),
        });
        const declarationModel2 = (0, make_declaration_model_1.makeDeclarationModel)({
            customerId: new unique_entity_id_1.UniqueEntityID('customer-2'),
        });
        inMemoryDeclarationModelsRepository.items.push(declarationModel1);
        inMemoryDeclarationModelsRepository.items.push(declarationModel2);
        const result = await sut.execute({
            declarationModelId: declarationModel1.id.toString(),
            customerId: 'another-customer-id',
        });
        expect(result.isLeft()).toBeTruthy();
    });
});
//# sourceMappingURL=get-declaration-model.test.js.map