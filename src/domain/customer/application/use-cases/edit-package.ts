import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Package } from '../../enterprise/entities/package'
import { PackageRepository } from '../repositories/package-repository'

interface EditPackagesRequest {
  packageId: string
  customerId: string
  shippingAddressId: string
  checkInsIds: string[]
  declarationModelId?: string
  taxId: string
  hasBattery: boolean
}

type EditPackagesResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    package: Package
  }
>

export class EditPackagesUseCase {
  constructor(private packageRepository: PackageRepository) {}

  async execute({
    packageId,
    customerId,
    shippingAddressId,
    checkInsIds,
    declarationModelId,
    taxId,
    hasBattery,
  }: EditPackagesRequest): Promise<EditPackagesResponse> {
    const pkg = await this.packageRepository.findById(packageId)

    if (!pkg) {
      return left(new ResourceNotFoundError())
    }

    if (pkg.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const newPkg = Package.create(
      {
        customerId: new UniqueEntityID(customerId),
        parcelForwardingId: new UniqueEntityID(parcelForwardingId),
        shippingAddressId: new UniqueEntityID(shippingAddressId),
        checkInsId: checkInsId.map((id) => new UniqueEntityID(id)),
        declarationModelId: new UniqueEntityID(declarationModelId),
        hasBattery,
      },
      new UniqueEntityID(packageId),
    )

    await this.packageRepository.save(newPkg)

    return right({
      package: newPkg,
    })
  }
}
