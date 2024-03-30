import { AttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/attachments-repository'
import { Attachment } from '@/domain/parcel-forwarding/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }

  async findManyByIds(ids: string[]) {
    return this.items.filter((item) => ids.includes(item.id.toString()))
  }
}
