import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AttachmentProps {
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get link() {
    return this.props.link
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id)
    return attachment
  }
}
