import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CheckInAttachment,
  CheckInAttachmentProps,
} from '@/domain/parcel-forwarding/enterprise/entities/check-in-attachment'
import { PrismaCheckInAttachmentsMapper } from '@/infra/database/prisma/mappers/prisma-check-in-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeCheckInAttachment(
  override: Partial<CheckInAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const checkInAttachment = CheckInAttachment.create(
    {
      checkInId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return checkInAttachment
}

@Injectable()
export class CheckInAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCheckInAttachment(
    data: Partial<CheckInAttachmentProps> = {},
  ): Promise<CheckInAttachment> {
    const checkInAttachment = makeCheckInAttachment(data)

    await this.prisma.checkInAttachment.create({
      data: PrismaCheckInAttachmentsMapper.toPrisma(checkInAttachment),
    })

    return checkInAttachment
  }
}
