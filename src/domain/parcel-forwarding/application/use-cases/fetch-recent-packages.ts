import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { PackagePreview } from '../../enterprise/entities/value-objects/package-preview'

interface FetchRecentPackagesUseCaseRequest {
  parcelForwardingId: string
  page: number
}

type FetchRecentPackagesUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    packagePreview: PackagePreview[]
  }
>
@Injectable()
export class FetchRecentPackagesUseCase {
  constructor(private packageRepository: PackageRepository) {}

  async execute({
    parcelForwardingId,
    page,
  }: FetchRecentPackagesUseCaseRequest): Promise<FetchRecentPackagesUseCaseResponse> {
    const packagePreview =
      await this.packageRepository.findManyRecentByParcelForwardingId(
        parcelForwardingId,
        page,
      )

    if (packagePreview.length === 0) {
      return left(new ResourceNotFoundError('No packages found.'))
    }

    if (
      parcelForwardingId !== packagePreview[0].parcelForwardingId.toString()
    ) {
      return left(
        new NotAllowedError('You are not allowed to access this resource.'),
      )
    }

    return right({ packagePreview })
  }
}
