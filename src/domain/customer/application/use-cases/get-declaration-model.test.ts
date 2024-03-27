import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { GetDeclarationModelUseCase } from './get-declaration-model'
import { makeDeclarationModelItem } from 'test/factories/make-declaration-model-item'
import { makeDeclarationModel } from 'test/factories/make-declaration-model'

let inMemoryDeclarationModelItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let sut: GetDeclarationModelUseCase

describe('Get Customs Declaration', () => {
  beforeEach(() => {
    inMemoryDeclarationModelItemsRepository =
      new InMemoryDeclarationModelItemsRepository()
    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelItemsRepository,
      )
    sut = new GetDeclarationModelUseCase(
      inMemoryDeclarationModelsRepository,
      inMemoryDeclarationModelItemsRepository,
    )
  })

  it('should be able to get a customs declaration', async () => {
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

    const anotherDeclarationModel = makeDeclarationModel({
      customerId: new UniqueEntityID('customer-2'),
    })

    await inMemoryDeclarationModelsRepository.create(anotherDeclarationModel)

    const result = await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: declarationModel.customerId.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      declarationModel,
    })
    expect(result.value).toEqual({
      declarationModel: expect.objectContaining({
        customerId: declarationModel.customerId,
      }),
    })
  })

  it('should not be able to get a customs declaration', async () => {
    const declarationModel1 = makeDeclarationModel({
      customerId: new UniqueEntityID('customer-1'),
    })

    const declarationModel2 = makeDeclarationModel({
      customerId: new UniqueEntityID('customer-2'),
    })

    inMemoryDeclarationModelsRepository.items.push(declarationModel1)
    inMemoryDeclarationModelsRepository.items.push(declarationModel2)

    const result = await sut.execute({
      declarationModelId: declarationModel1.id.toString(),
      customerId: 'another-customer-id',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
