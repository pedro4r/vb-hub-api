import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { PackageDetails } from '../../enterprise/entities/value-objects/package-details'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'

interface GetPackageUseCaseRequest {
  packageId: string
  parcelForwardingId: string
  checkInsPageNumber: number
}

type GetPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    packageDetails: PackageDetails
  }
>

@Injectable()
export class GetPackageUseCase {
  constructor(private packageRepository: PackageRepository) {}

  async execute({
    packageId,
    parcelForwardingId,
    checkInsPageNumber,
  }: GetPackageUseCaseRequest): Promise<GetPackageUseCaseResponse> {
    const packageDetails = await this.packageRepository.findDetailsById(
      packageId,
      checkInsPageNumber,
    )

    if (!packageDetails) {
      return left(new ResourceNotFoundError())
    }

    if (parcelForwardingId !== packageDetails.parcelForwardingId.toString()) {
      return left(new NotAllowedError())
    }

    return right({ packageDetails })
  }
}
