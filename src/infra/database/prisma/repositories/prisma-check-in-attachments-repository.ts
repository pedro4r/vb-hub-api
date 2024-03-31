import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CheckInAttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/check-in-attachments-repository'
import { CheckInAttachment } from '@/domain/parcel-forwarding/enterprise/entities/check-in-attachment'
import { PrismaCheckInAttachmentsMapper } from '../mappers/prisma-check-in-attachment-mapper'

@Injectable()
export class PrismaCheckInAttachmentsRepository
  implements CheckInAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: CheckInAttachment[]): Promise<void> {
    await Promise.all(
      attachments.map((item, index) => {
        const itemData = PrismaCheckInAttachmentsMapper.toPrisma(item, index)
        return this.prisma.checkInAttachment.create({
          data: itemData,
        })
      }),
    )
  }

  async deleteMany(checkInAttachments: CheckInAttachment[]): Promise<void> {
    const attachmentIds = checkInAttachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })
    await this.prisma.checkInAttachment.deleteMany({
      where: {
        attachmentId: {
          in: attachmentIds,
        },
      },
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async deleteManyByCheckInId(checkInId: string): Promise<void> {
    const checkInAttachments = await this.prisma.checkInAttachment.findMany({
      where: {
        checkInId,
      },
    })

    const attachmentIds = checkInAttachments.map((attachment) => {
      return attachment.attachmentId
    })

    await this.prisma.checkInAttachment.deleteMany({
      where: {
        checkInId,
      },
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async findManyByCheckInId(checkInId: string): Promise<CheckInAttachment[]> {
    const checkInAttachments = await this.prisma.checkInAttachment.findMany({
      where: {
        checkInId,
      },
    })

    return checkInAttachments.map(PrismaCheckInAttachmentsMapper.toDomain)
  }
}
