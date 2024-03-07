import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInRepository } from '../repositories/check-in-repository'

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
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkInId,
    parcelForwardingId,
    customerId,
  }: DeleteCheckInUseCaseRequest): Promise<DeleteCheckInUseCaseResponse> {
    const checkin = await this.checkInRepository.findById(checkInId)

    if (!checkin) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== checkin.customerId.toString()) {
      return left(new NotAllowedError())
    }

    if (parcelForwardingId !== checkin.parcelForwardingId.toString()) {
      return left(new NotAllowedError())
    }

    await this.checkInRepository.delete(checkin)

    return right(null)
  }
}
