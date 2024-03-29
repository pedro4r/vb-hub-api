import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { InMemoryCheckInsAttachmentsRepository } from './in-memory-check-ins-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  constructor(
    private checkInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository,
  ) {}

  async findManyByPackageId(packadeId: string) {
    const checkIns = this.items.filter(
      (item) => item.packageId?.toString() === packadeId,
    )

    return checkIns
  }

  async linkManyCheckInToPackage(checkIns: PackageCheckIn[]) {
    checkIns.forEach((checkIn) => {
      const item = this.items.find(
        (item) => item.id.toString() === checkIn.checkInId.toString(),
      )

      if (item) {
        item.packageId = checkIn.packageId
      }
    })
  }

  async unlinkManyCheckInToPackage(checkIns: PackageCheckIn[]) {
    checkIns.forEach((checkIn) => {
      const item = this.items.find(
        (item) => item.id.toString() === checkIn.checkInId.toString(),
      )

      if (item) {
        item.packageId = null
      }
    })
  }

  async findManyRecent(parcelForwardingId: string, page: number) {
    const checkIns = this.items
      .filter(
        (item) => item.parcelForwardingId.toString() === parcelForwardingId,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async delete(checkin: CheckIn) {
    const itemIndex = this.items.findIndex((item) => item.id === checkin.id)
    this.items.splice(itemIndex, 1)

    this.checkInsAttachmentsRepository.deleteManyByCheckInId(
      checkin.id.toString(),
    )
  }

  async findById(id: string) {
    const checkin = this.items.find((item) => item.id.toString() === id)

    if (!checkin) {
      return null
    }

    return checkin
  }

  async save(checkin: CheckIn) {
    const itemIndex = this.items.findIndex((item) => item.id === checkin.id)

    this.items[itemIndex] = checkin

    await this.checkInsAttachmentsRepository.createMany(
      checkin.attachments.getNewItems(),
    )

    await this.checkInsAttachmentsRepository.deleteMany(
      checkin.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(checkin.id)
  }

  async create(checkin: CheckIn) {
    this.items.push(checkin)

    await this.checkInsAttachmentsRepository.createMany(
      checkin.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(checkin.id)
  }
}
