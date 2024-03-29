import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CheckInAttachment } from '@/domain/parcel-forwarding/enterprise/entities/check-in-attachment'
import {
  Prisma,
  CheckInAttachment as PrismaCheckInAttachment,
} from '@prisma/client'

export class PrismaCheckInAttachmentsMapper {
  static toDomain(raw: PrismaCheckInAttachment): CheckInAttachment {
    return CheckInAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.attachmentId),
        checkInId: new UniqueEntityID(raw.checkInId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    attachment: CheckInAttachment,
    index?: number,
  ): Prisma.CheckInAttachmentUncheckedCreateInput {
    // index is used to create a unique createdAt date
    // and respect the order of the items in the array
    return {
      id: attachment.id.toString(),
      attachmentId: attachment.attachmentId.toString(),
      checkInId: attachment.checkInId.toString(),
      createdAt: new Date(Date.now() + (index ?? 1) * 1000),
    }
  }
}
