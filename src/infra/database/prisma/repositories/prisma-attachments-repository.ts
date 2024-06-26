import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { Attachment } from '@/domain/parcel-forwarding/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/attachments-repository'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByIds(ids: string[]): Promise<Attachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return attachments.map(PrismaAttachmentMapper.toDomain)
  }

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}
