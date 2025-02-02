import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opitional'
import { PackageCreatedEvent } from '../events/package-created-event'
import { CustomsDeclarationList } from './customs-declaration-list'
import { PackageCheckInsList } from './package-check-ins-list'

export enum PackageStatus {
  REQUESTED = 1,
  UNPAID = 2,
  PAID = 3,
  SHIPPED = 4,
  DELIVERED = 5,
  RETURNED = 6,
  WITHDRAWN = 7,
  CANCELLED = 8,
}

export interface PackageProps {
  customerId: UniqueEntityID
  parcelForwardingId: UniqueEntityID
  shippingAddressId: UniqueEntityID
  checkIns: PackageCheckInsList
  customsDeclarationList: CustomsDeclarationList
  status: PackageStatus
  weight?: number | null
  hasBattery: boolean
  trackingNumber?: string | null
  createdAt: Date
  updatedAt?: Date
}

export class Package extends AggregateRoot<PackageProps> {
  get customerId() {
    return this.props.customerId
  }

  get parcelForwardingId() {
    return this.props.parcelForwardingId
  }

  get shippingAddressId() {
    return this.props.shippingAddressId
  }

  set shippingAddressId(id: UniqueEntityID) {
    this.props.shippingAddressId = id
    this.touch()
  }

  get checkIns() {
    return this.props.checkIns
  }

  set checkIns(checkIns: PackageCheckInsList) {
    this.props.checkIns = checkIns
    this.touch()
  }

  get customsDeclarationList() {
    return this.props.customsDeclarationList
  }

  set customsDeclarationList(customsDeclarationList: CustomsDeclarationList) {
    this.props.customsDeclarationList = customsDeclarationList
    this.touch()
  }

  get status(): string {
    return PackageStatus[this.props.status]
  }

  getStatusAsCode(): PackageStatus {
    return this.props.status
  }

  set status(status: PackageStatus) {
    this.props.status = status
    this.touch()
  }

  get weight() {
    return this.props.weight
  }

  set weight(weight: number | undefined | null) {
    this.props.weight = weight
    this.touch()
  }

  get hasBattery() {
    return this.props.hasBattery
  }

  set hasBattery(hasBattery: boolean) {
    this.props.hasBattery = hasBattery
    this.touch()
  }

  get trackingNumber() {
    return this.props.trackingNumber
  }

  set trackingNumber(trackingNumber: string | undefined | null) {
    this.props.trackingNumber = trackingNumber
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  isStatus(status: PackageStatus): boolean {
    return this.props.status === status
  }

  static create(
    props: Optional<
      PackageProps,
      'createdAt' | 'customsDeclarationList' | 'checkIns' | 'status'
    >,
    id?: UniqueEntityID,
  ) {
    const pkg = new Package(
      {
        ...props,
        checkIns: props.checkIns ?? new PackageCheckInsList(),
        customsDeclarationList:
          props.customsDeclarationList ?? new CustomsDeclarationList(),
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? PackageStatus.REQUESTED,
      },
      id,
    )

    const isNewPackage = !id

    if (isNewPackage) {
      pkg.addDomainEvent(new PackageCreatedEvent(pkg))
    }

    return pkg
  }

  static mapStatus(status: number): PackageStatus {
    return PackageStatus[status as unknown as keyof typeof PackageStatus]
  }
}
