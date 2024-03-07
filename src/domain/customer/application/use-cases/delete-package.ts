import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PackageRepository } from '../repositories/package-repository'

interface DeletePackageUseCaseRequest {
  customerId: string
  packageId: string
}

type DeletePackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeletePackageUseCase {
  constructor(private packageRepository: PackageRepository) {}

  async execute({
    customerId,
    packageId,
  }: DeletePackageUseCaseRequest): Promise<DeletePackageUseCaseResponse> {
    const pkg = await this.packageRepository.findById(packageId)

    if (!pkg) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== pkg.customerId.toString()) {
      return left(new NotAllowedError())
    }

    await this.packageRepository.delete(pkg)

    return right(null)
  }
}
