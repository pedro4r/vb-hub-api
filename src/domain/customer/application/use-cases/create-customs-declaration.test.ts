import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { CreateCustomsDeclaration } from './create-customs-declaration'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'

let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: CreateCustomsDeclaration

describe('Create Customs Declaration', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository(
        inMemoryCustomsDeclarationItemsRepository,
      )
    sut = new CreateCustomsDeclaration(inMemoryCustomsDeclarationRepository)
  })

  it('should be able to create a customs declaration', async () => {
    const result = await sut.execute({
      customerId: 'customer-id',
      title: 'New customs declaration',
      customsDeclarationItems: [
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

    const customsDeclarationId = result.value?.customsDeclaration.id

    expect(result.isRight()).toBe(true)
    expect(inMemoryCustomsDeclarationRepository.items[0]).toEqual(
      result.value?.customsDeclaration,
    )
    expect(inMemoryCustomsDeclarationItemsRepository.items).toEqual([
      expect.objectContaining({
        description: 'Item 1',
        customsDeclarationId,
      }),
      expect.objectContaining({
        description: 'Item 2',
        customsDeclarationId,
      }),
    ])
  })
})
