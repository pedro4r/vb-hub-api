import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { DeclarationModelItem } from '../../enterprise/entities/declaration-model-item'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { EditDeclarationModel } from './edit-declaration-model'
import { makeDeclarationModelItem } from 'test/factories/make-declaration-model-item'
import { makeDeclarationModel } from 'test/factories/make-declaration-model'

let inMemoryDeclarationModelItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let sut: EditDeclarationModel

let declarationModelItems: DeclarationModelItem[]
let declarationModel: DeclarationModel

describe('Edit Customs Declaration', () => {
  beforeEach(async () => {
    inMemoryDeclarationModelItemsRepository =
      new InMemoryDeclarationModelItemsRepository()
    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelItemsRepository,
      )
    sut = new EditDeclarationModel(
      inMemoryDeclarationModelsRepository,
      inMemoryDeclarationModelItemsRepository,
    )

    declarationModel = makeDeclarationModel({
      customerId: new UniqueEntityID('customer-1'),
    })

    declarationModelItems = [
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
  })

  it('should be able to edit a customs declaration when all declaration items with the same id change their props', async () => {
    const result = await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: declarationModel.customerId.toString(),
      title: declarationModel.title,
      items: declarationModelItems.map((item, i) => ({
        props: {
          declarationModelId: declarationModel.id,
          description: `New description ${i + 1}`,
          value: 100,
          quantity: 10,
        },
        id: item.id.toString(),
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(3)
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
    ])
  })

  it('should be able to edit a customs declaration when remove one declaration item', async () => {
    const result = await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: declarationModel.customerId.toString(),
      title: declarationModel.title,
      items: declarationModelItems.slice(0, -1).map((item, i) => ({
        id: item.id.toString(),
        props: {
          declarationModelId: declarationModel.id,
          description: `New description ${i + 1}`,
          value: 100,
          quantity: 10,
        },
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(2)
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
    ])
  })

  it('should be able to edit a customs declaration when add more items', async () => {
    declarationModelItems.push(
      makeDeclarationModelItem({
        declarationModelId: declarationModel.id,
      }),
    )

    const result = await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: declarationModel.customerId.toString(),
      title: declarationModel.title,
      items: declarationModelItems.map((item, i) => ({
        id: item.id.toString(),
        props: {
          declarationModelId: declarationModel.id,
          description: `New description ${i + 1}`,
          value: 100,
          quantity: 10,
        },
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(4)
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
    ])
  })

  it('should be able to edit only the customs declaration title', async () => {
    const result = await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: declarationModel.customerId.toString(),
      title: 'My new title',
      items: declarationModelItems.map((item) => ({
        id: item.id.toString(),
        props: {
          declarationModelId: declarationModel.id,
          description: item.description,
          value: item.value,
          quantity: item.quantity,
        },
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeclarationModelItemsRepository.items).toHaveLength(3)
    expect(inMemoryDeclarationModelsRepository.items[0].title).toBe(
      'My new title',
    )
    expect(inMemoryDeclarationModelItemsRepository.items).toEqual(
      declarationModelItems,
    )
  })

  it('should not be able to edit a customs declaration from another user', async () => {
    const result = await sut.execute({
      declarationModelId: declarationModel.id.toString(),
      customerId: 'another-customer-id',
      title: 'My new title',
      items: declarationModelItems.map((item) => ({
        id: item.id.toString(),
        props: {
          declarationModelId: declarationModel.id,
          description: item.description,
          value: item.value,
          quantity: item.quantity,
        },
      })),
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
