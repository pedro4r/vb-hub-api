import { CheckInAttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/check-in-attachment-repository'
import { CheckInAttachment } from '@/domain/parcel-forwarding/enterprise/entities/check-in-attachment'

export class InMemoryCheckInsAttachmentsRepository
  implements CheckInAttachmentsRepository
{
  public items: CheckInAttachment[] = []

  async findManyByCheckInId(checkInId: string) {
    const checkInAttachments = this.items.filter(
      (item) => item.checkInId.toString() === checkInId,
    )
    return checkInAttachments
  }

  async createMany(attachments: CheckInAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: CheckInAttachment[]): Promise<void> {
    const checkInAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = checkInAttachments
  }

  async deleteManyByCheckInId(checkInId: string) {
    const checkInAttachments = this.items.filter(
      (item) => item.checkInId.toString() !== checkInId,
    )
    this.items = checkInAttachments
  }
}
