import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { DeleteCustomsDeclaration } from './delete-customs-declaration'
import { makeCustomsDeclaration } from 'test/factories/make-customs-declaration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let sut: DeleteCustomsDeclaration

describe('Delete Customs Declaration', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository()
    sut = new DeleteCustomsDeclaration(inMemoryCustomsDeclarationRepository)
  })

  it('should be able to delete a customs declaration', async () => {
    const customsDeclaration1 = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
      packageId: new UniqueEntityID('package-1'),
    })

    const customsDeclaration2 = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-2'),
      packageId: new UniqueEntityID('package-2'),
    })

    inMemoryCustomsDeclarationRepository.items.push(customsDeclaration1)
    inMemoryCustomsDeclarationRepository.items.push(customsDeclaration2)

    await sut.execute({
      packageId: customsDeclaration1.packageId.toString(),
      customerId: customsDeclaration1.customerId.toString(),
    })

    expect(inMemoryCustomsDeclarationRepository.items.length === 1).toBeTruthy()
    expect(inMemoryCustomsDeclarationRepository.items[0]).toEqual(
      customsDeclaration2,
    )
  })

  it('should not be able to delete a customs declaration from another customer', async () => {
    const customsDeclaration1 = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
      packageId: new UniqueEntityID('package-1'),
    })

    inMemoryCustomsDeclarationRepository.items.push(customsDeclaration1)

    const result = await sut.execute({
      customerId: 'customer-2',
      packageId: customsDeclaration1.packageId.toString(),
    })

    expect(result.isLeft).toBeTruthy()
    expect(inMemoryCustomsDeclarationRepository.items.length === 1).toBeTruthy()
  })
})
