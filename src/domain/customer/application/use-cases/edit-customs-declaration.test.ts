import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditCustomsDeclaration } from './edit-customs-declaration'
import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { makeCustomsDeclaration } from 'test/factories/make-customs-declaration'

let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: EditCustomsDeclaration

describe('Edit Customs Declaration', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository()
    sut = new EditCustomsDeclaration(inMemoryCustomsDeclarationRepository)
  })

  it('should be able to edit a customs declaration', async () => {
    const customsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
      packageId: new UniqueEntityID('package-1'),
    })

    await inMemoryCustomsDeclarationRepository.create(customsDeclaration)

    await sut.execute({
      customerId: customsDeclaration.customerId.toString(),
      packageId: customsDeclaration.packageId.toString(),
      itemsList: [
        {
          description: 'New description',
          quantity: 2,
          value: 10,
        },
      ],
    })

    expect(
      inMemoryCustomsDeclarationRepository.items[0].itemList[0],
    ).toMatchObject({
      description: 'New description',
      quantity: 2,
      value: 10,
    })
  })

  it('should not be able to edit a customs declaration from antoher customer', async () => {
    const customsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
      packageId: new UniqueEntityID('package-1'),
    })

    await inMemoryCustomsDeclarationRepository.create(customsDeclaration)

    const result = await sut.execute({
      customerId: 'another-customer-id',
      packageId: customsDeclaration.packageId.toString(),
      itemsList: [
        {
          description: 'New description',
          quantity: 2,
          value: 10,
        },
      ],
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
