import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Package } from '../../enterprise/entities/package'
import { PackageRepository } from '../repositories/package-repository'
import { DeclarationModelItemsRepository } from '../repositories/declaration-model-item-repository'
import { PackageShippingAddressRepository } from '../repositories/package-shipping-address-repository'
import { CustomsDeclarationItem } from '../../enterprise/entities/customs-declaration-item'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PackageCheckIn } from '../../enterprise/entities/package-check-in'

interface EditPackagesRequest {
  packageId: string
  customerId: string
  shippingAddressId: string
  checkInsIds: string[]
  declarationModelId?: string
  hasBattery: boolean
}

type EditPackagesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    package: Package
  }
>

export class EditPackagesUseCase {
  constructor(
    private packageRepository: PackageRepository,
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
    private packageShippingAddressRepository: PackageShippingAddressRepository,
  ) {}

  async execute({
    packageId,
    customerId,
    shippingAddressId,
    checkInsIds,
    declarationModelId,
    hasBattery,
  }: EditPackagesRequest): Promise<EditPackagesResponse> {
    const pkg = await this.packageRepository.findById(packageId)

    if (!pkg) {
      return left(new ResourceNotFoundError())
    }

    if (pkg.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    pkg.hasBattery = hasBattery

    await this.packageShippingAddressRepository.delete(
      pkg.shippingAddressId.toString(),
    )

    await this.packageShippingAddressRepository.create(shippingAddressId)

    pkg.shippingAddressId = new UniqueEntityID(shippingAddressId)

    const packageCheckIns = checkInsIds.map((checkInId) => {
      return PackageCheckIn.create({
        checkInId: new UniqueEntityID(checkInId),
        packageId: pkg.id,
      })
    })

    pkg.checkIns.update(packageCheckIns)

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
          return CustomsDeclarationItem.create(
            {
              packageId: pkg.id,
              description: declarationModelItem.description,
              value: declarationModelItem.value,
              quantity: declarationModelItem.quantity,
            },
            new UniqueEntityID(declarationModelItem.id.toString()),
          )
        },
      )
      pkg.customsDeclarationList.update(customsDeclarationItems)
    }

    await this.packageRepository.save(pkg)

    return right({
      package: pkg,
    })
  }
}
