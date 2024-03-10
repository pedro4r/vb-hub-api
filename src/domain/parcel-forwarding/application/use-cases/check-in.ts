import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CheckIn } from '../../enterprise/entities/check-in'
import { CheckInAttachment } from '../../enterprise/entities/check-in-attachment'
import { CheckInAttachmentList } from '../../enterprise/entities/check-in-attachment-list'
import { Either, right } from '@/core/either'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { Injectable } from '@nestjs/common'

interface CheckInUseCaseRequest {
  parcelForwardingId: string
  customerId: string
  status: number
  details?: string
  weight?: number
  attachmentsIds: string[]
}

type CheckInUseCaseResponse = Either<
  null,
  {
    checkin: CheckIn
  }
>
@Injectable()
export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    parcelForwardingId,
    customerId,
    details,
    weight,
    status,
    attachmentsIds,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkin = CheckIn.create({
      parcelForwardingId: new UniqueEntityID(parcelForwardingId),
      customerId: new UniqueEntityID(customerId),
      status,
      details,
      weight,
    })

    const checkInAttachments = attachmentsIds.map((attachmentId) => {
      return CheckInAttachment.create({
        checkInId: checkin.id,
        attachmentId: new UniqueEntityID(attachmentId),
      })
    })

    checkin.attachments = new CheckInAttachmentList(checkInAttachments)

    await this.checkInsRepository.create(checkin)

    return right({
      checkin,
    })
  }
}
