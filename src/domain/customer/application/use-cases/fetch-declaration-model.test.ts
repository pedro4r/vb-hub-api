import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { FetchDeclarationModelsUseCase } from './fetch-declaration-model'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { makeDeclarationModel } from 'test/factories/make-declaration-model'
import { makeDeclarationModelItem } from 'test/factories/make-declaration-model-item'

let inMemoryDeclarationModelsItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let sut: FetchDeclarationModelsUseCase

describe('Fetch Customs Declarations', () => {
  beforeEach(async () => {
    inMemoryDeclarationModelsItemsRepository =
      new InMemoryDeclarationModelItemsRepository()
    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelsItemsRepository,
      )
    sut = new FetchDeclarationModelsUseCase(
      inMemoryDeclarationModelsRepository,
      inMemoryDeclarationModelsItemsRepository,
    )

    await Promise.all(
      new Array(7).fill(null).map(async (_, i) => {
        const declarationModel = makeDeclarationModel({
          customerId: new UniqueEntityID('customer-1'),
          title: `Customs Declaration ${i + 1}`,
        })

        const declarationModelsItems = [
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

        declarationModel.items = new DeclarationModelList(
          declarationModelsItems,
        )

        return inMemoryDeclarationModelsRepository.create(declarationModel)
      }),
    )
  })

  it('should be able to fetch customs declarations', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      (result.value as { declarationModels: DeclarationModel[] })
        .declarationModels.length,
    ).toEqual(7)
    expect(
      (result.value as { declarationModels: DeclarationModel[] })
        .declarationModels[0].items.currentItems.length,
    ).toEqual(3)

    expect(inMemoryDeclarationModelsRepository.items.length).toBe(7)
    expect(inMemoryDeclarationModelsItemsRepository.items.length).toBe(21)
  })
})
