import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { EditPackagesUseCase } from './edit-package'
import { makePackage } from 'test/factories/make-package'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { InMemoryPackageShippingAddressRepository } from 'test/repositories/in-memory-package-shipping-address-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeclarationModelItem } from 'test/factories/make-customs-declaration-item'
import { makeCheckIn } from 'test/factories/make-check-in'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { PackageCheckInsList } from '../../enterprise/entities/package-check-ins-list'
import { PackageCheckIn } from '../../enterprise/entities/package-check-in'
import { CustomsDeclarationItem } from '../../enterprise/entities/customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
import { makeDeclarationModel } from 'test/factories/make-customs-declaration'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'

let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryDeclarationModelsItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let inMemoryPackageShippingAddressRepository: InMemoryPackageShippingAddressRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: EditPackagesUseCase

describe('Edit Package', () => {
  beforeEach(async () => {
    inMemoryCheckInsAttachmentsRepository =
      new InMemoryCheckInsAttachmentsRepository()

    inMemoryCheckInsRepository = new InMemoryCheckInsRepository(
      inMemoryCheckInsAttachmentsRepository,
    )
    inMemoryDeclarationModelsItemsRepository =
      new InMemoryDeclarationModelItemsRepository()

    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelsItemsRepository,
      )

    inMemoryCustomsDeclarationItemsRepository =
      new InMemoryCustomsDeclarationItemsRepository()

    inMemoryPackageRepository = new InMemoryPackageRepository(
      inMemoryCustomsDeclarationItemsRepository,
      inMemoryCheckInsRepository,
    )

    inMemoryShippingAddressRepository = new InMemoryShippingAddressRepository()

    inMemoryPackageShippingAddressRepository =
      new InMemoryPackageShippingAddressRepository(
        inMemoryShippingAddressRepository,
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

    const shippingAddress2 = makeShippingAddress(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('shippingAddress-2'),
    )

    await inMemoryShippingAddressRepository.create(shippingAddress1)
    await inMemoryShippingAddressRepository.create(shippingAddress2)

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
        taxId: 'tax-1',
        hasBattery: false,
      },
      new UniqueEntityID('package-1'),
    )

    newPkg.checkIns = new PackageCheckInsList(packageCheckIns)

    const declarationModel = makeDeclarationModel(
      {
        customerId: new UniqueEntityID('customer-1'),
        title: 'Declaration Model 1',
      },
      new UniqueEntityID('declaration-model-1'),
    )

    const declarationModelItems = [
      makeDeclarationModelItem({
        declarationModelId: new UniqueEntityID('declaration-model-1'),
      }),
      makeDeclarationModelItem({
        declarationModelId: new UniqueEntityID('declaration-model-1'),
      }),
      makeDeclarationModelItem({
        declarationModelId: new UniqueEntityID('declaration-model-1'),
      }),
    ]

    const customsDeclarationItems = declarationModelItems.map(
      (declarationModelItem) => {
        return CustomsDeclarationItem.create({
          packageId: newPkg.id,
          description: declarationModelItem.description,
          value: declarationModelItem.value,
          quantity: declarationModelItem.quantity,
        })
      },
    )

    declarationModel.items = new DeclarationModelList(declarationModelItems)

    inMemoryDeclarationModelsRepository.create(declarationModel)

    newPkg.items = new CustomsDeclarationList(customsDeclarationItems)

    await inMemoryPackageRepository.create(newPkg)
  })

  it('should be able to edit a package', async () => {
    const result = await sut.execute({
      packageId: 'package-1',
      customerId: 'customer-1',
      shippingAddressId: 'shippingAddress-2',
      checkInsIds: ['check-in-3'],
      declarationModelId: 'declaration-model-1',
      taxId: 'tax-2',
      hasBattery: true,
    })

    expect(result.isRight()).toBeTruthy()
  })

  // it('should not be able to edit a package from another customer', async () => {
  //   const newPkg = makePackage()

  //   await inMemoryPackageRepository.create(newPkg)

  //   const result = await sut.execute({
  //     packageId: newPkg.id.toString(),
  //     customerId: 'another-customer-id',
  //     parcelForwardingId: newPkg.parcelForwardingId.toString(),
  //     shippingAddressId: 'shippingAddress-2',
  //     checkInsId: ['checkin-2', 'checkin-3'],
  //     declarationModelId: 'customs-declaration-2',
  //     hasBattery: true,
  //   })

  //   expect(result.isLeft()).toBeTruthy()
  // })
})
