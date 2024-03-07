import { AttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/attachments-repository'
import { Attachment } from '@/domain/parcel-forwarding/enterprise/entities/attachment'
import { CheckInAttachment } from '@/domain/parcel-forwarding/enterprise/entities/check-in-attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  create(attachment: Attachment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public items: CheckInAttachment[] = []
}
