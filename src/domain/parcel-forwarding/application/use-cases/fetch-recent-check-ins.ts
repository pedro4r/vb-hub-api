import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { CheckIn } from '../../enterprise/entities/check-in'
import { Injectable } from '@nestjs/common'

interface FetchCheckInsUseCaseRequest {
  parcelForwardingId: string
  page: number
}

type FetchCheckInsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    checkIns: CheckIn[]
  }
>
@Injectable()
export class FetchRecentCheckInsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    parcelForwardingId,
    page,
  }: FetchCheckInsUseCaseRequest): Promise<FetchCheckInsUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyRecent(
      parcelForwardingId,
      page,
    )

    if (checkIns.length === 0) {
      return left(new ResourceNotFoundError('Check-ins not found.'))
    }

    if (parcelForwardingId !== checkIns[0].parcelForwardingId.toString()) {
      return left(
        new NotAllowedError('You are not allowed to fetch these check-ins.'),
      )
    }

    return right({ checkIns })
  }
}
