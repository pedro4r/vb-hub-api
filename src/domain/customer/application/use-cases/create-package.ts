import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Package } from '../../enterprise/entities/package'
import { PackageRepository } from '../repositories/package-repository'
import { CustomsDeclarationItem } from '../../enterprise/entities/customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeclarationModelItemsRepository } from '../repositories/declaration-model-item-repository'

interface CreatePackageUseCaseRequest {
  customerId: string
  parcelForwardingId: string
  shippingAddressId: string
  checkInsId: string[]
  declarationModelId?: string
  taxId?: string
  hasBattery: boolean
}

type CreatePackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    pkg: Package
  }
>

export class CreatePackageUseCase {
  constructor(
    private packageRepository: PackageRepository,
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
  ) {}

  async execute({
    customerId,
    parcelForwardingId,
    shippingAddressId,
    checkInsId,
    declarationModelId,
    taxId,
    hasBattery,
  }: CreatePackageUseCaseRequest): Promise<CreatePackageUseCaseResponse> {
    const pkg = Package.create({
      customerId: new UniqueEntityID(customerId),
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      shippingAddressId: new UniqueEntityID(shippingAddressId),
      checkInsId: checkInsId.map((id) => new UniqueEntityID(id)),
      taxId: taxId ? new UniqueEntityID(taxId) : null,
      hasBattery,
    })

    if (declarationModelId) {
      const declarationModelItems =
        await this.declarationModelItemsRepository.findManyByDeclarationModelId(
          declarationModelId,
        )

      if (!declarationModelItems) {
        return left(new ResourceNotFoundError())
      }

      const customsDeclarationItems = declarationModelItems.map(
        (declarationModelItem) => {
          return CustomsDeclarationItem.create({
            packageId: pkg.id,
            description: declarationModelItem.description,
            value: declarationModelItem.value,
            quantity: declarationModelItem.quantity,
          })
        },
      )
      pkg.items = new CustomsDeclarationList(customsDeclarationItems)
    }

    await this.packageRepository.create(pkg)

    return right({
      pkg,
    })
  }
}
