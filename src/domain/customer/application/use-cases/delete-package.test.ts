import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { makePackage } from 'test/factories/make-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeletePackageUseCase } from './delete-package'
import { InMemoryPackageShippingAddressRepository } from 'test/repositories/in-memory-package-shipping-address-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { PackageCheckInsList } from '../../enterprise/entities/package-check-ins-list'
import { makeCustomsDeclarationItems } from 'test/factories/make-customs-declaration-items'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { makeCheckIn } from 'test/factories/make-check-in'
import { PackageCheckIn } from '../../enterprise/entities/package-check-in'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let inMemoryPackageShippingAddressRepository: InMemoryPackageShippingAddressRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: DeletePackageUseCase

describe('Delete an Package', () => {
  beforeEach(async () => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()

    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryCustomerRepository,
    )

    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()

    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()

    inMemoryPackageShippingAddressRepository =
      new InMemoryPackageShippingAddressRepository(
        inMemoryShippingAddressRepository,
      )

    inMemoryPackageRepository = new InMemoryPackageRepository(
      inMemoryCustomsDeclarationItemsRepository,
      inMemoryPackageShippingAddressRepository,
      inMemoryCheckInsRepository,
    )
    sut = new DeletePackageUseCase(inMemoryPackageRepository)

    const shippingAddress = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-1'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress)

    const checkIn1 = makeCheckIn(
      {
        customerId: new UniqueEntityID('customer-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwarding-1'),
      },
      new UniqueEntityID('check-in-1'),
    )
    const checkIn2 = makeCheckIn(
      {
        customerId: new UniqueEntityID('customer-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwarding-1'),
      },
      new UniqueEntityID('check-in-2'),
    )

    await inMemoryCheckInsRepository.create(checkIn1)
    await inMemoryCheckInsRepository.create(checkIn2)

    const packageCheckIns = [
      PackageCheckIn.create({
        checkInId: checkIn1.id,
        packageId: new UniqueEntityID('package-1'),
      }),
      PackageCheckIn.create({
        checkInId: checkIn2.id,
        packageId: new UniqueEntityID('package-1'),
      }),
    ]

    const newPkg = makePackage(
      {
        shippingAddressId: new UniqueEntityID('shippingAddress-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwarding-1'),
        hasBattery: false,
      },
      new UniqueEntityID('package-1'),
    )

    newPkg.checkIns = new PackageCheckInsList(packageCheckIns)

    const customsDeclarationItems = makeCustomsDeclarationItems(newPkg.id)

    newPkg.customsDeclarationList = new CustomsDeclarationList(
      customsDeclarationItems,
    )

    await inMemoryPackageRepository.create(newPkg)
  })

  it('should be able to delete a package', async () => {
    expect(inMemoryPackageShippingAddressRepository.items.length).toBe(1)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toBe(3)

    const result = await sut.execute({
      customerId: 'customer-1',
      packageId: 'package-1',
    })

    expect(result.isRight()).toBeTruthy()
    const checkIns =
      await inMemoryCheckInsRepository.findManyByPackageId('package-1')
    expect(checkIns.length).toBe(0)
    expect(inMemoryPackageRepository.items.length === 0).toBeTruthy()
    expect(inMemoryPackageShippingAddressRepository.items.length).toBe(0)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toBe(0)
  })

  it('should not be able to delete a package from another customer', async () => {
    const result = await sut.execute({
      customerId: 'customer-2',
      packageId: 'package-1',
    })

    expect(result.isLeft()).toBeTruthy()
    const checkIns =
      await inMemoryCheckInsRepository.findManyByPackageId('package-1')
    expect(checkIns.length).toBe(2)
    expect(inMemoryPackageRepository.items.length).toBe(1)
    expect(inMemoryPackageShippingAddressRepository.items.length).toBe(1)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toBe(3)
  })
})
