import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HubId } from './value-objects/hub-id'
import { Entity } from '@/core/entities/entity'

export interface CustomerProps {
  parcelForwardingId: UniqueEntityID
  hubId: HubId
  name: string
  email: string
  password: string
}

export class Customer extends Entity<CustomerProps> {
  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get hubId() {
    return this.props.hubId
  }

  set hubId(hubId: HubId) {
    this.props.hubId = hubId
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer(props, id)

    return customer
  }
}
