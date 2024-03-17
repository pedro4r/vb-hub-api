import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { EditPackagesUseCase } from './edit-package'
import { makePackage } from 'test/factories/make-package'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'

let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: EditPackagesUseCase

describe('Edit Package', () => {
  beforeEach(() => {
    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository()
    inMemoryPackageRepository = new InMemoryPackageRepository(
      inMemoryDeclarationModelsRepository,
    )
    sut = new EditPackagesUseCase(inMemoryPackageRepository)
  })

  it('should be able to edit a package', async () => {
    const newPkg = makePackage()

    await inMemoryPackageRepository.create(newPkg)

    const result = await sut.execute({
      packageId: newPkg.id.toString(),
      customerId: newPkg.customerId.toString(),
      parcelForwardingId: newPkg.parcelForwardingId.toString(),
      shippingAddressId: 'shippingAddress-2',
      checkInsId: ['checkin-2', 'checkin-3'],
      declarationModelId: 'customs-declaration-2',
      hasBattery: true,
    })

    expect(result.isRight()).toBeTruthy()

    expect(inMemoryPackageRepository.items[0].id.toString()).toEqual(
      newPkg.id.toString(),
    )
    expect(
      inMemoryPackageRepository.items[0].shippingAddressId.toString(),
    ).toEqual('shippingAddress-2')

    expect(inMemoryPackageRepository.items[0].checkInsId.length).toEqual(2)
  })

  it('should not be able to edit a package from another customer', async () => {
    const newPkg = makePackage()

    await inMemoryPackageRepository.create(newPkg)

    const result = await sut.execute({
      packageId: newPkg.id.toString(),
      customerId: 'another-customer-id',
      parcelForwardingId: newPkg.parcelForwardingId.toString(),
      shippingAddressId: 'shippingAddress-2',
      checkInsId: ['checkin-2', 'checkin-3'],
      declarationModelId: 'customs-declaration-2',
      hasBattery: true,
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
