import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditCustomsDeclaration } from './edit-customs-declaration'
import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { makeCustomsDeclaration } from 'test/factories/make-customs-declaration'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { makeCustomsDeclarationItem } from 'test/factories/make-customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationItem } from '../../enterprise/entities/customs-declaration-item'

let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: EditCustomsDeclaration

let customsDeclarationItems: CustomsDeclarationItem[]
let customsDeclaration: CustomsDeclaration

describe('Edit Customs Declaration', () => {
  beforeEach(async () => {
    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository(
        inMemoryCustomsDeclarationItemsRepository,
      )
    sut = new EditCustomsDeclaration(
      inMemoryCustomsDeclarationRepository,
      inMemoryCustomsDeclarationItemsRepository,
    )

    customsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
    })

    customsDeclarationItems = [
      makeCustomsDeclarationItem({
        customsDeclarationId: customsDeclaration.id,
      }),
      makeCustomsDeclarationItem({
        customsDeclarationId: customsDeclaration.id,
      }),
      makeCustomsDeclarationItem({
        customsDeclarationId: customsDeclaration.id,
      }),
    ]

    customsDeclaration.items = new CustomsDeclarationList(
      customsDeclarationItems,
    )

    await inMemoryCustomsDeclarationRepository.create(customsDeclaration)
  })

  it('should be able to edit a customs declaration when all declaration items with the same id change their props', async () => {
    const result = await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: customsDeclaration.customerId.toString(),
      title: customsDeclaration.title,
      items: customsDeclarationItems.map((item, i) => ({
        id: item.id.toString(),
        props: {
          description: `New description ${i + 1}`,
          value: 100,
          quantity: 10,
        },
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCustomsDeclarationItemsRepository.items).toHaveLength(3)
    expect(inMemoryCustomsDeclarationItemsRepository.items).toEqual([
      expect.objectContaining({
        props: {
          description: 'New description 1',
          value: 100,
          quantity: 10,
        },
      }),
      expect.objectContaining({
        props: {
          description: 'New description 2',
          value: 100,
          quantity: 10,
        },
      }),
      expect.objectContaining({
        props: {
          description: 'New description 3',
          value: 100,
          quantity: 10,
        },
      }),
    ])
  })

  it('should be able to edit a customs declaration when remove one declaration item', async () => {
    const result = await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: customsDeclaration.customerId.toString(),
      title: customsDeclaration.title,
      items: customsDeclarationItems.slice(0, -1).map((item, i) => ({
        id: item.id.toString(),
        props: {
          description: `New description ${i + 1}`,
          value: 100,
          quantity: 10,
        },
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCustomsDeclarationItemsRepository.items).toHaveLength(2)
    expect(inMemoryCustomsDeclarationItemsRepository.items).toEqual([
      expect.objectContaining({
        props: {
          description: 'New description 1',
          value: 100,
          quantity: 10,
        },
      }),
      expect.objectContaining({
        props: {
          description: 'New description 2',
          value: 100,
          quantity: 10,
        },
      }),
    ])
  })

  it('should be able to edit a customs declaration when add more items', async () => {
    customsDeclarationItems.push(
      makeCustomsDeclarationItem({
        customsDeclarationId: customsDeclaration.id,
      }),
    )

    const result = await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: customsDeclaration.customerId.toString(),
      title: customsDeclaration.title,
      items: customsDeclarationItems.map((item, i) => ({
        id: item.id.toString(),
        props: {
          description: `New description ${i + 1}`,
          value: 100,
          quantity: 10,
        },
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCustomsDeclarationItemsRepository.items).toHaveLength(4)
    expect(inMemoryCustomsDeclarationItemsRepository.items).toEqual([
      expect.objectContaining({
        props: {
          description: 'New description 1',
          value: 100,
          quantity: 10,
        },
      }),
      expect.objectContaining({
        props: {
          description: 'New description 2',
          value: 100,
          quantity: 10,
        },
      }),
      expect.objectContaining({
        props: {
          description: 'New description 3',
          value: 100,
          quantity: 10,
        },
      }),
      expect.objectContaining({
        props: {
          description: 'New description 4',
          value: 100,
          quantity: 10,
        },
      }),
    ])
  })

  it('should be able to edit only the customs declaration title', async () => {
    const result = await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: customsDeclaration.customerId.toString(),
      title: 'My new title',
      items: customsDeclarationItems.map((item) => ({
        id: item.id.toString(),
        props: {
          description: item.description,
          value: item.value,
          quantity: item.quantity,
        },
      })),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryCustomsDeclarationItemsRepository.items).toHaveLength(3)
    expect(inMemoryCustomsDeclarationRepository.items[0].title).toBe(
      'My new title',
    )
    expect(inMemoryCustomsDeclarationItemsRepository.items).toEqual(
      customsDeclarationItems,
    )
  })

  it('should not be able to edit a customs declaration from another user', async () => {
    const result = await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: 'another-customer-id',
      title: 'My new title',
      items: customsDeclarationItems.map((item) => ({
        id: item.id.toString(),
        props: {
          description: item.description,
          value: item.value,
          quantity: item.quantity,
        },
      })),
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
