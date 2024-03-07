import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { makePackage } from 'test/factories/make-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeletePackageUseCase } from './delete-package'
import { InMemoryCustomsDeclarationRepository } from 'test/repositories/in-memory-customs-declaration-repository'
import { makeCustomsDeclaration } from 'test/factories/make-customs-declaration'

let inMemoryCustomsDeclarationRepository: InMemoryCustomsDeclarationRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: DeletePackageUseCase

describe('Delete an Package', () => {
  beforeEach(() => {
    inMemoryCustomsDeclarationRepository =
      new InMemoryCustomsDeclarationRepository()
    inMemoryPackageRepository = new InMemoryPackageRepository(
      inMemoryCustomsDeclarationRepository,
    )
    sut = new DeletePackageUseCase(inMemoryPackageRepository)
  })

  it('should be able to delete a package', async () => {
    const package1 = makePackage(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('package-1'),
    )

    const package2 = makePackage(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('package-2'),
    )

    inMemoryPackageRepository.items.push(package1)
    inMemoryPackageRepository.items.push(package2)

    await sut.execute({
      customerId: package1.customerId.toString(),
      packageId: package1.id.toString(),
    })

    expect(inMemoryPackageRepository.items.length === 1).toBeTruthy()
    expect(inMemoryPackageRepository.items[0]).toEqual(package2)
  })

  it('should not be able to delete a package from another customer', async () => {
    const pkg = makePackage(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('package-1'),
    )

    inMemoryPackageRepository.items.push(pkg)

    const result = await sut.execute({
      packageId: pkg.id.toString(),
      customerId: 'customer-2',
    })

    expect(result.isLeft).toBeTruthy()
    expect(inMemoryPackageRepository.items.length === 1).toBeTruthy()
  })

  it('should be able to delete customs declaration associated to a package', async () => {
    const customsDeclaration = makeCustomsDeclaration({
      customerId: new UniqueEntityID('customer-1'),
      packageId: new UniqueEntityID('package-1'),
    })

    inMemoryCustomsDeclarationRepository.items.push(customsDeclaration)

    expect(inMemoryCustomsDeclarationRepository.items.length === 1).toBeTruthy()

    const pkg1 = makePackage(
      {
        customerId: new UniqueEntityID('customer-1'),
        customsDeclarationId: new UniqueEntityID(
          customsDeclaration.id.toString(),
        ),
      },
      new UniqueEntityID('package-1'),
    )

    const pkg2 = makePackage(
      {
        customerId: new UniqueEntityID('customer-1'),
        customsDeclarationId: new UniqueEntityID(
          customsDeclaration.id.toString(),
        ),
      },
      new UniqueEntityID('package-2'),
    )

    inMemoryPackageRepository.items.push(pkg1)
    inMemoryPackageRepository.items.push(pkg2)

    const result = await sut.execute({
      packageId: pkg1.id.toString(),
      customerId: 'customer-1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryPackageRepository.items.length === 1).toBeTruthy()
    expect(inMemoryCustomsDeclarationRepository.items.length === 0).toBeTruthy()
  })
})
