import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Package } from '../../enterprise/entities/package'
import { PackageRepository } from '../repositories/package-repository'
import { CustomsDeclarationItem } from '../../enterprise/entities/customs-declaration-item'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeclarationModelItemsRepository } from '../repositories/declaration-model-item-repository'
import { PackageCheckIn } from '../../enterprise/entities/package-check-in'
import { PackageCheckInsList } from '../../enterprise/entities/package-check-ins-list'
import { Injectable } from '@nestjs/common'

interface CreatePackageUseCaseRequest {
  customerId: string
  parcelForwardingId: string
  shippingAddressId: string
  checkInsIds: string[]
  declarationModelId?: string
  hasBattery: boolean
}

type CreatePackageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    pkg: Package
  }
>

@Injectable()
export class CreatePackageUseCase {
  constructor(
    private packageRepository: PackageRepository,
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
  ) {}

  async execute({
    customerId,
    parcelForwardingId,
    shippingAddressId,
    checkInsIds,
    declarationModelId,
    hasBattery,
  }: CreatePackageUseCaseRequest): Promise<CreatePackageUseCaseResponse> {
    const pkg = Package.create({
      customerId: new UniqueEntityID(customerId),
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      shippingAddressId: new UniqueEntityID(shippingAddressId),
      hasBattery,
    })

    const packageCheckIns = checkInsIds.map((checkInId) => {
      return PackageCheckIn.create({
        checkInId: new UniqueEntityID(checkInId),
        packageId: pkg.id,
      })
    })

    pkg.checkIns = new PackageCheckInsList(packageCheckIns)

    if (declarationModelId) {
      const declarationModelItems =
        await this.declarationModelItemsRepository.findManyByDeclarationModelId(
          declarationModelId,
        )

      if (!declarationModelItems) {
        return left(
          new ResourceNotFoundError('Declaration Model Items not found'),
        )
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
      pkg.customsDeclarationList = new CustomsDeclarationList(
        customsDeclarationItems,
      )
    }

    await this.packageRepository.create(pkg)

    return right({
      pkg,
    })
  }
}
