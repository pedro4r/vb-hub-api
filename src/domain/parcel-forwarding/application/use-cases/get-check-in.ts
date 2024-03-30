import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { Injectable } from '@nestjs/common'
import { CheckInDetails } from '../../enterprise/entities/value-objects/check-in-details'

interface GetCheckInUseCaseRequest {
  checkInId: string
  parcelForwardingId: string
}

type GetCheckInUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    checkIn: CheckInDetails
  }
>

@Injectable()
export class GetCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
    parcelForwardingId,
  }: GetCheckInUseCaseRequest): Promise<GetCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findDetailsById(checkInId)

    if (!checkIn) {
      return left(new ResourceNotFoundError())
    }

    if (parcelForwardingId !== checkIn.parcelForwardingId.toString()) {
      return left(new NotAllowedError())
    }

    return right({ checkIn })
  }
}
