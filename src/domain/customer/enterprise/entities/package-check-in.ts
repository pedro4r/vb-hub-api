import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PackageCheckInProps {
  packageId: UniqueEntityID
  checkInId: UniqueEntityID
}

export class PackageCheckIn extends Entity<PackageCheckInProps> {
  get packageId() {
    return this.props.packageId
  }

  get checkInId() {
    return this.props.checkInId
  }

  static create(props: PackageCheckInProps, id?: UniqueEntityID) {
    const packageCheckIn = new PackageCheckIn(props, id)

    return packageCheckIn
  }
}
