import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { Injectable } from '@nestjs/common'
import { CheckInPreview } from '../../enterprise/entities/value-objects/check-in-preview'

interface FetchRecentCheckInsUseCaseRequest {
  parcelForwardingId: string
  page: number
}

type FetchRecentCheckInsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    checkInsPreview: CheckInPreview[]
  }
>
@Injectable()
export class FetchRecentCheckInsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    parcelForwardingId,
    page,
  }: FetchRecentCheckInsUseCaseRequest): Promise<FetchRecentCheckInsUseCaseResponse> {
    const checkInsPreview =
      await this.checkInsRepository.findManyRecentByParcelForwardingId(
        parcelForwardingId,
        page,
      )

    if (checkInsPreview.length === 0) {
      return left(new ResourceNotFoundError('Check-ins not found.'))
    }

    if (
      parcelForwardingId !== checkInsPreview[0].parcelForwardingId.toString()
    ) {
      return left(
        new NotAllowedError('You are not allowed to fetch these check-ins.'),
      )
    }

    return right({ checkInsPreview })
  }
}
