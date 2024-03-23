import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { CreateDeclarationModelUseCase } from './create-declaration-model'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'

let inMemoryDeclarationModelItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let sut: CreateDeclarationModelUseCase

describe('Create Customs Declaration', () => {
  beforeEach(() => {
    inMemoryDeclarationModelItemsRepository =
      new InMemoryDeclarationModelItemsRepository()
    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelItemsRepository,
      )
    sut = new CreateDeclarationModelUseCase(
      inMemoryDeclarationModelsRepository,
    )
  })

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
    })

    const declarationModelId = result.value?.declarationModel.id

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeclarationModelsRepository.items[0]).toEqual(
      result.value?.declarationModel,
    )
    expect(inMemoryDeclarationModelItemsRepository.items).toEqual([
      expect.objectContaining({
        description: 'Item 1',
        declarationModelId,
      }),
      expect.objectContaining({
        description: 'Item 2',
        declarationModelId,
      }),
    ])
  })
})
