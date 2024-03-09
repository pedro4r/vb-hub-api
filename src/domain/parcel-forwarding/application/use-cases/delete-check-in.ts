import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInsRepository } from '../repositories/check-ins-repository'

interface DeleteCheckInUseCaseRequest {
  checkInId: string
  parcelForwardingId: string
  customerId: string
}

type DeleteCheckInUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
    parcelForwardingId,
    customerId,
  }: DeleteCheckInUseCaseRequest): Promise<DeleteCheckInUseCaseResponse> {
    const checkin = await this.checkInsRepository.findById(checkInId)

    if (!checkin) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== checkin.customerId.toString()) {
      return left(new NotAllowedError())
    }

    if (parcelForwardingId !== checkin.parcelForwardingId.toString()) {
      return left(new NotAllowedError())
    }

    await this.checkInsRepository.delete(checkin)

    return right(null)
  }
}
