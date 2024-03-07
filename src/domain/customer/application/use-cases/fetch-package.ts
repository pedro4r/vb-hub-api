import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PackageRepository } from '../repositories/package-repository'
import { Package } from '../../enterprise/entities/package'

interface FetchPackageUseCaseRequest {
  customerId: string
}

type FetchPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    packages: Package[]
  }
>

export class FetchPackageUseCase {
  constructor(private packageRepository: PackageRepository) {}

  async execute({
    customerId,
  }: FetchPackageUseCaseRequest): Promise<FetchPackageUseCaseResponse> {
    const packages =
      await this.packageRepository.findManyByCustomerId(customerId)

    if (!packages) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== packages[0]?.customerId.toString()) {
      return left(new NotAllowedError())
    }

    return right({
      packages,
    })
  }
}
