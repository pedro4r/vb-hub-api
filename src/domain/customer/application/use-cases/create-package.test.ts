import { InMemoryPackageRepository } from 'test/repositories/in-memory-package-repository'
import { CreatePackageUseCase } from './create-package'
import { InMemoryCustomsDeclarationItemsRepository } from 'test/repositories/in-memory-customs-declaration-items-repository'
import { makeDeclarationModel } from 'test/factories/make-customs-declaration'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeclarationModelItem } from 'test/factories/make-customs-declaration-item'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { InMemoryDeclarationModelsRepository } from 'test/repositories/in-memory-declaration-model-repository'
import { InMemoryDeclarationModelItemsRepository } from 'test/repositories/in-memory-declaration-model-items-repository'

let inMemoryDeclarationModelsItemsRepository: InMemoryDeclarationModelItemsRepository
let inMemoryDeclarationModelsRepository: InMemoryDeclarationModelsRepository
let inMemoryCustomsDeclarationItemsRepository: InMemoryCustomsDeclarationItemsRepository
let inMemoryPackageRepository: InMemoryPackageRepository
let sut: CreatePackageUseCase

describe('Create Package', () => {
  beforeEach(async () => {
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
      checkInsId: ['checkInId'],
      declarationModelId: 'declaration-model-1',
      hasBattery: true,
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryPackageRepository.items.length).toEqual(1)
    expect(inMemoryCustomsDeclarationItemsRepository.items.length).toEqual(3)
    expect(inMemoryDeclarationModelsRepository.items.length).toBe(7)
    expect(inMemoryDeclarationModelsItemsRepository.items.length).toBe(21)
  })
})
