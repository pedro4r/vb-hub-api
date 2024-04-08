import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { makePackage } from 'test/factories/make-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { InMemoryPackageShippingAddressRepository } from 'test/repositories/in-memory-package-shipping-address-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'

import { makeCustomsDeclarationItems } from 'test/factories/make-customs-declaration-items'

import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { makeCheckIn } from 'test/factories/make-check-in'

import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'
import { PackageCheckInsList } from '@/domain/customer/enterprise/entities/package-check-ins-list'
import { CustomsDeclarationList } from '@/domain/customer/enterprise/entities/customs-declaration-list'
import { makeCustomer } from 'test/factories/make-customer'
import { GetPackageCheckInsDetailsUseCase } from './get-package-check-ins-details'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeCheckInAttachment } from 'test/factories/make-check-in-attachment'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let inMemoryPackageShippingAddressRepository: InMemoryPackageShippingAddressRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: GetPackageCheckInsDetailsUseCase

describe('Get a Package Check-ins Details', () => {
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
    sut = new GetPackageCheckInsDetailsUseCase(inMemoryCheckInsRepository)

    const customer = makeCustomer({}, new UniqueEntityID('customer-1'))

    await inMemoryCustomerRepository.create(customer)

    const shippingAddress = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-1'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress)

    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('attachment-1')),
      makeAttachment({}, new UniqueEntityID('attachment-2')),
      makeAttachment({}, new UniqueEntityID('attachment-3')),
    )

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

    inMemoryCheckInsAttachmentsRepository.items.push(
      makeCheckInAttachment({
        checkInId: checkIn1.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn1.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
      makeCheckInAttachment({
        checkInId: checkIn2.id,
        attachmentId: new UniqueEntityID('attachment-3'),
      }),
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

  it('should be able to get a package check-ins details', async () => {
    expect(inMemoryPackageShippingAddressRepository.items.length).toBe(1)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toBe(3)

    const result = await sut.execute({
      parcelForwardingId: 'parcelForwarding-1',
      packageId: 'package-1',
      page: 1,
    })

    console.log(JSON.stringify(result.value, null, 2))

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      checkInsDetails: expect.arrayContaining([
        expect.objectContaining({
          checkInId: new UniqueEntityID('check-in-1'),
          hubId: expect.any(String),
          customerFirstName: expect.any(String),
          customerLastName: expect.any(String),
          status: expect.any(String),
        }),
      ]),
    })
  })

  it('should not be able to get a package details from another parcel forwarding company', async () => {
    const result = await sut.execute({
      parcelForwardingId: 'parcelForwarding-2',
      packageId: 'package-1',
      page: 1,
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
