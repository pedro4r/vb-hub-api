import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ParcelForwardingProps {
  name: string
  initials: string
  email: string
  password: string
}

export class ParcelForwarding extends Entity<ParcelForwardingProps> {
  get name() {
    return this.props.name
  }

  get initials() {
    return this.props.initials
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: ParcelForwardingProps, id?: UniqueEntityID) {
    const parcelForwarding = new ParcelForwarding(props, id)

    return parcelForwarding
  }
}
