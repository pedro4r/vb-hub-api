import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { DeleteCustomsDeclaration } from './delete-customs-declaration'
import { makeCustomsDeclaration } from 'test/factories/make-customs-declaration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { makeCustomsDeclarationItem } from 'test/factories/make-customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'

let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: DeleteCustomsDeclaration

describe('Delete Customs Declaration', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository(
        inMemoryCustomsDeclarationItemsRepository,
      )
    sut = new DeleteCustomsDeclaration(inMemoryCustomsDeclarationRepository)
  })

  it('should be able to delete a customs declaration', async () => {
    const customsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
    })

    const customsDeclarationItems = [
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

    expect(inMemoryCustomsDeclarationRepository.items.length === 1).toBeTruthy()
    expect(
      inMemoryCustomsDeclarationItemsRepository.items.length === 3,
    ).toBeTruthy()

    await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: customsDeclaration.customerId.toString(),
    })

    expect(inMemoryCustomsDeclarationRepository.items.length === 0).toBeTruthy()
    expect(
      inMemoryCustomsDeclarationItemsRepository.items.length === 0,
    ).toBeTruthy()
  })

  it('should not be able to delete a customs declaration with another user id', async () => {
    const customsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
    })

    const customsDeclarationItems = [
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

    const result = await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: 'customer-2',
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should not be able to delete a customs declaration with another customs declaration id', async () => {
    const customsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
    })

    const customsDeclarationItems = [
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

    const result = await sut.execute({
      customsDeclarationId: 'another-customs-declaration-id',
      customerId: customsDeclaration.customerId.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
