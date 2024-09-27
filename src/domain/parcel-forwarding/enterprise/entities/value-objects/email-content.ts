import { ValueObject } from '@/core/entities/value-object'

export interface EmailContentProps {
  sender: string
  recipient: string
  subject: string
  body: string
  attachments?: string[]
}

export class EmailContent extends ValueObject<EmailContentProps> {
  get sender() {
    return this.props.sender
  }

  get recipient() {
    return this.props.recipient
  }

  get subject() {
    return this.props.subject
  }

  get body() {
    return this.props.body
  }

  get attachments() {
    return this.props.attachments
  }

  static create(props: EmailContentProps) {
    return new EmailContent(props)
  }
}
