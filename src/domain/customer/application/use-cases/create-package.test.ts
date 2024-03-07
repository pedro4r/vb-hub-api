import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { CreatePackageUseCase } from './create-package'
import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'

let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: CreatePackageUseCase

describe('Create Package', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository()
    inMemoryPackageRepository = new InMemoryPackageRepository(
      inMemoryCustomsDeclarationRepository,
    )
    sut = new CreatePackageUseCase(inMemoryPackageRepository)
  })

  it('should be able to create a package', async () => {
    const result = await sut.execute({
      customerId: 'customerId',
      parcelForwardingId: 'parcelForwardingId',
      shippingAddressId: 'shippingAddressId',
      checkInsId: ['checkInId1', 'checkInId2'],
      customsDeclarationId: 'customsDeclarationId',
      taxId: 'taxId',
      hasBattery: true,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPackageRepository.items[0]).toEqual(result.value?.pkg)
    expect(inMemoryPackageRepository.items[0].customerId.toString()).toEqual(
      'customerId',
    )
  })
})
