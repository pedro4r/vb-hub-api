import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { makePackage } from 'test/factories/make-package'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { InMemoryPackageShippingAddressRepository } from 'test/repositories/in-memory-package-shipping-address-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { FilterPackagesUseCase } from './filter-packages'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let inMemoryPackageShippingAddressRepository: InMemoryPackageShippingAddressRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: FilterPackagesUseCase

describe('Fetch Recent Packages', () => {
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

    sut = new FilterPackagesUseCase(
      inMemoryPackageRepository,
      inMemoryCustomerRepository,
    )

    const customer1 = makeCustomer({}, new UniqueEntityID('customer-1'))

    await inMemoryCustomerRepository.create(customer1)

    const shippingAddress1 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-1'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress1)

    const newPkg1 = makePackage(
      {
        customerId: new UniqueEntityID('customer-1'),
        shippingAddressId: new UniqueEntityID('shippingAddress-1'),
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
        hasBattery: false,
      },
      new UniqueEntityID('package-1'),
    )

    await inMemoryPackageRepository.create(newPkg1)

    const customer2 = makeCustomer({}, new UniqueEntityID('customer-2'))

    await inMemoryCustomerRepository.create(customer2)

    const shippingAddress2 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-2'),
      },
      new UniqueEntityID('shippingAddress-2'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress2)

    const newPkg2 = makePackage(
      {
        customerId: new UniqueEntityID('customer-2'),
        shippingAddressId: new UniqueEntityID('shippingAddress-2'),
        parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
        hasBattery: false,
      },
      new UniqueEntityID('package-2'),
    )

    await inMemoryPackageRepository.create(newPkg2)
  })

  it('should be able to fetch recent packages', async () => {
    const result = await sut.execute({
      parcelForwardingId: 'parcel-forwarding-1',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(
      expect.objectContaining({
        packagesData: expect.objectContaining({
          packages: expect.arrayContaining([
            expect.objectContaining({
              parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
              customerId: new UniqueEntityID('customer-1'),
              hasBattery: expect.any(Boolean),
            }),
            expect.objectContaining({
              parcelForwardingId: new UniqueEntityID('parcel-forwarding-1'),
              customerId: new UniqueEntityID('customer-2'),
              hasBattery: expect.any(Boolean),
            }),
          ]),
        }),
      }),
    )
  })

  it('should not be able to fetch recent packages', async () => {
    const result = await sut.execute({
      parcelForwardingId: 'parcel-forwarding-2',
      page: 1,
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
