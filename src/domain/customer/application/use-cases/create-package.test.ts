import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { CreatePackageUseCase } from './create-package'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'
import { makeCheckIn } from 'test/factories/make-check-in'
import { Package } from '../../enterprise/entities/package'
import { InMemoryPackageShippingAddressRepository } from 'test/repositories/in-memory-package-shipping-address-repository'
import { InMemoryShippingAddressRepository } from 'test/repositories/in-memory-shipping-address-repository'
import { makeShippingAddress } from 'test/factories/make-shipping-address'
import { makeDeclarationModelItem } from 'test/factories/make-declaration-model-item'
import { makeDeclarationModel } from 'test/factories/make-declaration-model'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryCustomerRepository: InMemoryCustomerRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryDeclarationModelsItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryShippingAddressRepository: InMemoryShippingAddressRepository
let inMemoryPackageShippingAddressRepository: InMemoryPackageShippingAddressRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: CreatePackageUseCase

describe('Create Package', () => {
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

    inMemoryDeclarationModelsRepository =
      new InMemoryDeclarationModelsRepository(
        inMemoryDeclarationModelsItemsRepository,
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

    sut = new CreatePackageUseCase(
      inMemoryPackageRepository,
      inMemoryDeclarationModelsItemsRepository,
    )

    await Promise.all(
      new Array(2).fill(null).map(async (_, i) => {
        const declarationModel = makeDeclarationModel(
          {
            customerId: new UniqueEntityID('customer-1'),
            title: `Customs Declaration ${i + 1}`,
          },
          new UniqueEntityID(`declaration-model-${i + 1}`),
        )

        const declarationModelsItems = [
          makeDeclarationModelItem({
            declarationModelId: declarationModel.id,
          }),
          makeDeclarationModelItem({
            declarationModelId: declarationModel.id,
          }),
          makeDeclarationModelItem({
            declarationModelId: declarationModel.id,
          }),
        ]

        declarationModel.items = new DeclarationModelList(
          declarationModelsItems,
        )

        return await inMemoryDeclarationModelsRepository.create(
          declarationModel,
        )
      }),
    )

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
  })

  it('should be able to create a package', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
      parcelForwardingId: 'parcelForwarding-1',
      shippingAddressId: 'shippingAddress-1',
      checkInsIds: ['check-in-1', 'check-in-2'],
      declarationModelId: 'declaration-model-1',
      hasBattery: true,
    })

    expect(result.isRight()).toBe(true)

    const packageId = (result.value as { pkg: Package }).pkg.id

    expect((result.value as { pkg: Package }).pkg).toEqual(
      expect.objectContaining({
        customerId: new UniqueEntityID('customer-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwarding-1'),
        checkIns: expect.objectContaining({
          initial: expect.arrayContaining([
            expect.objectContaining({
              checkInId: new UniqueEntityID('check-in-1'),
              packageId,
            }),
            expect.objectContaining({
              checkInId: new UniqueEntityID('check-in-2'),
              packageId,
            }),
          ]),
        }),
        hasBattery: true,
      }),
    )

    expect(inMemoryPackageRepository.items.length).toEqual(1)
    expect(inMemoryCheckInsRepository.items.length).toEqual(2)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toEqual(3)
    expect(inMemoryDeclarationModelsRepository.items.length).toBe(2)
    expect(inMemoryDeclarationModelsItemsRepository.items.length).toBe(6)
    expect(inMemoryPackageShippingAddressRepository.items.length).toBe(1)
  })
})
