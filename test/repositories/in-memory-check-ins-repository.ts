import { CheckInRepository } from '@/domain/parcel-forwarding/application/repositories/check-in-repository'
import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { InMemoryCheckInsAttachmentsRepository } from './in-memory-check-ins-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryCheckInsRepository implements CheckInRepository {
  public items: CheckIn[] = []

  constructor(
    private checkInsAttachmentRepository: InMemoryCheckInsAttachmentsRepository,
  ) {}

  async delete(checkin: CheckIn) {
    const itemIndex = this.items.findIndex((item) => item.id === checkin.id)
    this.items.splice(itemIndex, 1)

    this.checkInsAttachmentRepository.deleteManyByCheckInId(
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

    await this.checkInsAttachmentRepository.createMany(
      checkin.attachments.getNewItems(),
    )

    await this.checkInsAttachmentRepository.deleteMany(
      checkin.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(checkin.id)
  }

  async create(checkin: CheckIn) {
    this.items.push(checkin)

    await this.checkInsAttachmentRepository.createMany(
      checkin.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(checkin.id)
  }
}
