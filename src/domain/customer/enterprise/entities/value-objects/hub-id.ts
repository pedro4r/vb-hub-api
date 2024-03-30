import { ValueObject } from '@/core/entities/value-object'

export interface HubIdProps {
  parcelForwadingInitials: string
  customerCode: number
}

export class HubId extends ValueObject<HubIdProps> {
  get parcelForwadingInitials() {
    return this.props.parcelForwadingInitials
  }

  get customerCode() {
    return this.props.customerCode
  }

  get value() {
    return `${this.props.parcelForwadingInitials}${this.props.customerCode}`
  }

  static create(props: HubIdProps) {
    return new HubId(props)
  }
}
