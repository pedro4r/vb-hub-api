import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { makeDeclarationModel } from 'test/factories/make-customs-declaration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeclarationModelItem } from 'test/factories/make-customs-declaration-item'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { DeleteDeclarationModel } from './delete-declaration-model'

let inMemoryDeclarationModelItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let sut: DeleteDeclarationModel

describe('Delete Customs Declaration', () => {
  beforeEach(() => {
    inMemoryDeclarationModelItemsRepository =
      new InMemoryDeclarationModelItemsRepository()
    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelItemsRepository,
      )
    sut = new DeleteDeclarationModel(inMemoryDeclarationModelsRepository)
  })

  it('should be able to delete a customs declaration', async () => {
    const declarationModel = makeDeclarationModel({
      customerId: new UniqueEntityID('customer-1'),
    })

    const declarationModelItems = [
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
    ]

    declarationModel.items = new DeclarationModelList(declarationModelItems)

    await inMemoryDeclarationModelsRepository.create(declarationModel)

    expect(inMemoryDeclarationModelsRepository.items.length === 1).toBeTruthy()
    expect(
      inMemoryDeclarationModelItemsRepository.items.length === 3,
    ).toBeTruthy()

    await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: declarationModel.customerId.toString(),
    })

    expect(inMemoryDeclarationModelsRepository.items.length === 0).toBeTruthy()
    expect(
      inMemoryDeclarationModelItemsRepository.items.length === 0,
    ).toBeTruthy()
  })

  it('should not be able to delete a customs declaration with another user id', async () => {
    const declarationModel = makeDeclarationModel({
      customerId: new UniqueEntityID('customer-1'),
    })

    const declarationModelItems = [
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
    ]

    declarationModel.items = new DeclarationModelList(declarationModelItems)

    await inMemoryDeclarationModelsRepository.create(declarationModel)

    const result = await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: 'customer-2',
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should not be able to delete a customs declaration with another customs declaration id', async () => {
    const declarationModel = makeDeclarationModel({
      customerId: new UniqueEntityID('customer-1'),
    })

    const declarationModelItems = [
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
    ]

    declarationModel.items = new DeclarationModelList(declarationModelItems)

    await inMemoryDeclarationModelsRepository.create(declarationModel)

    const result = await sut.execute({
      declarationModelId: 'another-customs-declaration-id',
      customerId: declarationModel.customerId.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
