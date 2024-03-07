import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CheckInAttachment,
  CheckInAttachmentProps,
} from '@/domain/parcel-forwarding/enterprise/entities/check-in-attachment'

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
