import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { EditPackagesUseCase } from './edit-package'
import { makePackage } from 'test/factories/make-package'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { InMemoryPackageShippingAddressRepository } from 'test/repositories/in-memory-package-shipping-address-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCheckIn } from 'test/factories/make-check-in'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { PackageCheckInsList } from '../../enterprise/entities/package-check-ins-list'
import { PackageCheckIn } from '../../enterprise/entities/package-check-in'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
import { makeCustomsDeclarationItems } from 'test/factories/make-customs-declaration-items'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { makeDeclarationModelWithItems } from 'test/factories/make-declaration-model-with-items'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryDeclarationModelsItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let inMemoryPackageShippingAddressRepository: InMemoryPackageShippingAddressRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: EditPackagesUseCase

describe('Edit Package', () => {
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
    inMemoryDeclarationModelsItemsRepository =
      new InMemoryDeclarationModelItemsRepository()

    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()

    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelsItemsRepository,
      )

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

    sut = new EditPackagesUseCase(
      inMemoryPackageRepository,
      inMemoryDeclarationModelsItemsRepository,
      inMemoryPackageShippingAddressRepository,
    )

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

  it('should be able to edit a package', async () => {
    const shippingAddress2 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-2'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress2)

    const declarationModel = makeDeclarationModelWithItems(
      {
        customerId: new UniqueEntityID('customer-1'),
        title: `Customs Declaration 2`,
      },
      new UniqueEntityID('declaration-model-2'),
    )

    inMemoryDeclarationModelsRepository.create(declarationModel)

    const result = await sut.execute({
      packageId: 'package-1',
      customerId: 'customer-1',
      shippingAddressId: 'shippingAddress-2',
      checkInsIds: ['check-in-3'],
      declarationModelId: 'declaration-model-2',
      hasBattery: true,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryPackageShippingAddressRepository.items.length).toEqual(1)
    const itemsWithPackageId = inMemoryCheckInsRepository.items.filter(
      (item) => item.packageId?.toString() === 'package-1',
    )

    expect(itemsWithPackageId.length).toBe(1)
    expect(result.value).toEqual({
      package: expect.objectContaining({
        hasBattery: true,
        customsDeclarationList: expect.objectContaining({
          currentItems: expect.arrayContaining([
            expect.objectContaining({
              description: 'Item 1',
            }),
            expect.objectContaining({
              description: 'Item 2',
            }),
            expect.objectContaining({
              description: 'Item 3',
            }),
          ]),
        }),
        checkIns: expect.objectContaining({
          currentItems: expect.arrayContaining([
            expect.objectContaining({
              checkInId: new UniqueEntityID('check-in-3'),
            }),
          ]),
        }),
      }),
    })
  })

  it('should not be able to edit a package from another customer', async () => {
    const shippingAddress2 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-2'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress2)

    const declarationModel = makeDeclarationModelWithItems(
      {
        customerId: new UniqueEntityID('customer-1'),
        title: `Customs Declaration 2`,
      },
      new UniqueEntityID('declaration-model-2'),
    )

    inMemoryDeclarationModelsRepository.create(declarationModel)

    const result = await sut.execute({
      packageId: 'package-1',
      customerId: 'customer-2',
      shippingAddressId: 'shippingAddress-2',
      checkInsIds: ['check-in-3'],
      declarationModelId: 'declaration-model-2',
      hasBattery: true,
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
