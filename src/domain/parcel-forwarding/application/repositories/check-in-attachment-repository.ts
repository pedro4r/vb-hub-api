import { CheckInAttachment } from '../../enterprise/entities/check-in-attachment'

export abstract class CheckInAttachmentsRepository {
  abstract createMany(attachments: CheckInAttachment[]): Promise<void>
  abstract deleteMany(attachments: CheckInAttachment[]): Promise<void>
  abstract deleteManyByCheckInId(checkInId: string): Promise<void>
  abstract findManyByCheckInId(checkInId: string): Promise<CheckInAttachment[]>
}
