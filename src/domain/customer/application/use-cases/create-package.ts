import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Package } from '../../enterprise/entities/package'
import { PackageRepository } from '../repositories/package-repository'

interface CreatePackageUseCaseRequest {
  customerId: string
  parcelForwardingId: string
  shippingAddressId: string
  checkInsId: string[]
  customsDeclarationId: string
  taxId?: string
  hasBattery: boolean
}

type CreatePackageUseCaseResponse = Either<
  null,
  {
    pkg: Package
  }
>

export class CreatePackageUseCase {
  constructor(private packageRepository: PackageRepository) {}

  async execute({
    customerId,
    parcelForwardingId,
    shippingAddressId,
    checkInsId,
    customsDeclarationId,
    taxId,
    hasBattery,
  }: CreatePackageUseCaseRequest): Promise<CreatePackageUseCaseResponse> {
    const pkg = Package.create({
      customerId: new UniqueEntityID(customerId),
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      shippingAddressId: new UniqueEntityID(shippingAddressId),
      checkInsId: checkInsId.map((id) => new UniqueEntityID(id)),
      customsDeclarationId: new UniqueEntityID(customsDeclarationId),
      taxId: taxId ? new UniqueEntityID(taxId) : null,
      hasBattery,
    })

    await this.packageRepository.create(pkg)

    return right({
      pkg,
    })
  }
}
