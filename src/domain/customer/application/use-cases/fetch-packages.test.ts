import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { makePackage } from 'test/factories/make-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchPackageUseCase } from './fetch-package'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { InMemoryPackageShippingAddressRepository } from 'test/repositories/in-memory-package-shipping-address-repository'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { makeCheckIn } from 'test/factories/make-check-in'
import { PackageCheckIn } from '../../enterprise/entities/package-check-in'
import { PackageCheckInsList } from '../../enterprise/entities/package-check-ins-list'
import { makeCustomsDeclarationItems } from 'test/factories/make-customs-declaration-items'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
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
let sut: FetchPackageUseCase

describe('Get an Package', () => {
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
      inMemoryCustomerRepository,
    )
    sut = new FetchPackageUseCase(inMemoryPackageRepository)

    const shippingAddress1 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-1'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress1)

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

    const checkIn3 = makeCheckIn(
      {
        customerId: new UniqueEntityID('customer-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwarding-1'),
      },
      new UniqueEntityID('check-in-3'),
    )

    await inMemoryCheckInsRepository.create(checkIn1)
    await inMemoryCheckInsRepository.create(checkIn2)
    await inMemoryCheckInsRepository.create(checkIn3)

    const packageCheckIns1 = [
      PackageCheckIn.create({
        checkInId: checkIn1.id,
        packageId: new UniqueEntityID('package-1'),
      }),
      PackageCheckIn.create({
        checkInId: checkIn2.id,
        packageId: new UniqueEntityID('package-1'),
      }),
    ]

    const packageCheckIns2 = [
      PackageCheckIn.create({
        checkInId: checkIn3.id,
        packageId: new UniqueEntityID('package-1'),
      }),
    ]

    const pkg1 = makePackage(
      {
        shippingAddressId: new UniqueEntityID('shippingAddress-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwarding-1'),
        hasBattery: false,
      },
      new UniqueEntityID('package-1'),
    )

    const pkg2 = makePackage(
      {
        shippingAddressId: new UniqueEntityID('shippingAddress-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwarding-1'),
        hasBattery: false,
      },
      new UniqueEntityID('package-2'),
    )

    pkg1.checkIns = new PackageCheckInsList(packageCheckIns1)
    pkg2.checkIns = new PackageCheckInsList(packageCheckIns2)

    const customsDeclarationItems1 = makeCustomsDeclarationItems(pkg1.id)
    const customsDeclarationItems2 = makeCustomsDeclarationItems(pkg2.id)

    pkg1.customsDeclarationList = new CustomsDeclarationList(
      customsDeclarationItems1,
    )

    pkg2.customsDeclarationList = new CustomsDeclarationList(
      customsDeclarationItems2,
    )

    await inMemoryPackageRepository.create(pkg1)
    await inMemoryPackageRepository.create(pkg2)
  })

  it('should be able to fetch packages', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      packages: expect.arrayContaining([
        expect.objectContaining({
          id: new UniqueEntityID('package-1'),
        }),
        expect.objectContaining({
          id: new UniqueEntityID('package-2'),
        }),
      ]),
    })
    expect(inMemoryPackageRepository.items.length).toEqual(2)
    expect(inMemoryCheckInsRepository.items.length).toEqual(3)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toEqual(6)
  })

  it('should not be able to fetch packages from another customer', async () => {
    const result = await sut.execute({
      customerId: 'customer-2',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
