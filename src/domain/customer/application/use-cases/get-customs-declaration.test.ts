import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { makeCustomsDeclaration } from 'test/factories/make-customs-declaration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { GetCustomsDeclaration } from './get-customs-declaration'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { makeCustomsDeclarationItem } from 'test/factories/make-customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'

let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: GetCustomsDeclaration

describe('Get Customs Declaration', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository(
        inMemoryCustomsDeclarationItemsRepository,
      )
    sut = new GetCustomsDeclaration(
      inMemoryCustomsDeclarationRepository,
      inMemoryCustomsDeclarationItemsRepository,
    )
  })

  it('should be able to get a customs declaration', async () => {
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

    const anotherCustomsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-2'),
    })

    await inMemoryCustomsDeclarationRepository.create(anotherCustomsDeclaration)

    const result = await sut.execute({
      customsDeclarationId: customsDeclaration.id.toString(),
      customerId: customsDeclaration.customerId.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      customsDeclaration,
    })
    expect(result.value).toEqual({
      customsDeclaration: expect.objectContaining({
        customerId: customsDeclaration.customerId,
      }),
    })
  })

  it('should not be able to get a customs declaration', async () => {
    const customsDeclaration1 = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
    })

    const customsDeclaration2 = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-2'),
    })

    inMemoryCustomsDeclarationRepository.items.push(customsDeclaration1)
    inMemoryCustomsDeclarationRepository.items.push(customsDeclaration2)

    const result = await sut.execute({
      customsDeclarationId: customsDeclaration1.id.toString(),
      customerId: 'another-customer-id',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
