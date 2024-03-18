import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { CreatePackageUseCase } from './create-package'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { makeDeclarationModel } from 'test/factories/make-customs-declaration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeclarationModelItem } from 'test/factories/make-customs-declaration-item'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'
import { Package } from '../../enterprise/entities/package'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory-check-ins-repository'
import { InMemoryCheckInsAttachmentsRepository } from 'test/repositories/in-memory-check-ins-attachments-repository'

let inMemoryCheckInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryDeclarationModelsItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: CreatePackageUseCase

describe('Create Package', () => {
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
    )
    sut = new CreatePackageUseCase(
      inMemoryPackageRepository,
      inMemoryDeclarationModelsItemsRepository,
      inMemoryCheckInsRepository,
    )

    await Promise.all(
      new Array(7).fill(null).map(async (_, i) => {
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
  })

  it('should be able to create a package', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
      parcelForwardingId: 'parcelForwardingId',
      shippingAddressId: 'shippingAddressId',
      checkInsId: ['checkInId1', 'checkInId2'],
      declarationModelId: 'declaration-model-1',
      taxId: 'taxId',
      hasBattery: true,
    })

    expect(result.isRight()).toBe(true)

    expect((result.value as { pkg: Package }).pkg).toEqual(
      expect.objectContaining({
        customerId: new UniqueEntityID('customer-1'),
        parcelForwardingId: new UniqueEntityID('parcelForwardingId'),
        checkInsId: [
          new UniqueEntityID('checkInId1'),
          new UniqueEntityID('checkInId2'),
        ],
        taxId: 'taxId',
        hasBattery: true,
      }),
    )

    expect(inMemoryPackageRepository.items.length).toEqual(1)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toEqual(3)
    expect(inMemoryDeclarationModelsRepository.items.length).toBe(7)
    expect(inMemoryDeclarationModelsItemsRepository.items.length).toBe(21)
  })
})
