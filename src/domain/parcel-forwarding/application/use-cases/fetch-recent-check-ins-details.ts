import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { Injectable } from '@nestjs/common'
import { CheckInDetails } from '../../enterprise/entities/value-objects/check-in-details'

interface FetchRecentCheckInsDetailsUseCaseRequest {
  parcelForwardingId: string
  page: number
}

type FetchRecentCheckInsDetailsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    checkInsDetails: CheckInDetails[]
  }
>
@Injectable()
export class FetchRecentCheckInsDetailsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    parcelForwardingId,
    page,
  }: FetchRecentCheckInsDetailsUseCaseRequest): Promise<FetchRecentCheckInsDetailsUseCaseResponse> {
    const checkInsDetails =
      await this.checkInsRepository.findManyRecentCheckInsDetailsByParcelForwardingId(
        parcelForwardingId,
        page,
      )

    if (checkInsDetails.length === 0) {
      return left(new ResourceNotFoundError('Check-ins not found.'))
    }

    if (
      parcelForwardingId !== checkInsDetails[0].parcelForwardingId.toString()
    ) {
      return left(
        new NotAllowedError('You are not allowed to fetch these check-ins.'),
      )
    }

    return right({ checkInsDetails })
  }
}
