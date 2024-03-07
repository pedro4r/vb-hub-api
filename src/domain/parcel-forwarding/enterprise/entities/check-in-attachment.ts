import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CheckInAttachmentProps {
  checkInId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class CheckInAttachment extends Entity<CheckInAttachmentProps> {
  get checkInId() {
    return this.props.checkInId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: CheckInAttachmentProps, id?: UniqueEntityID) {
    const checkInAttachment = new CheckInAttachment(props, id)
    return checkInAttachment
  }
}
