import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CheckInDetails } from '../../enterprise/entities/value-objects/check-in-details'
import { CheckInsRepository } from '../repositories/check-ins-repository'

interface GetPackageCheckInsDetailsUseCaseRequest {
  packageId: string
  parcelForwardingId: string
  page: number
}

type GetPackageCheckInsDetailsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    checkInsDetails: CheckInDetails[]
  }
>

@Injectable()
export class GetPackageCheckInsDetailsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    packageId,
    parcelForwardingId,
    page,
  }: GetPackageCheckInsDetailsUseCaseRequest): Promise<GetPackageCheckInsDetailsUseCaseResponse> {
    const checkInsDetails =
      await this.checkInsRepository.findManyWithDetailsByPackageId(
        packageId,
        page,
      )

    if (!checkInsDetails) {
      return left(new ResourceNotFoundError())
    }

    if (
      parcelForwardingId !== checkInsDetails[0].parcelForwardingId.toString()
    ) {
      return left(new NotAllowedError())
    }

    return right({ checkInsDetails })
  }
}
