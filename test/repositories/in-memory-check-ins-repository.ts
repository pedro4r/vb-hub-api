import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { InMemoryCheckInsAttachmentsRepository } from './in-memory-check-ins-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'
import { InMemoryCustomerRepository } from './in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { CheckInDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-details'
import { CheckInPreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  constructor(
    private checkInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private customerRepository: InMemoryCustomerRepository,
  ) {}

  async findManyByPackageId(packadeId: string) {
    const checkIns = this.items.filter(
      (item) => item.packageId?.toString() === packadeId,
    )

    return checkIns
  }

  async findManyWithDetailsByPackageId(packageId: string, page: number) {
    const checkIns = this.items
      .filter((item) => item.packageId?.toString() === packageId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    const checkInsDetails = await Promise.all(
      checkIns.map(async (checkIn) => {
        const customer = await this.customerRepository.findById(
          checkIn.customerId.toString(),
        )

        if (!customer) {
          throw new Error(
            `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
          )
        }

        const checkInAttachments =
          await this.checkInsAttachmentsRepository.findManyByCheckInId(
            checkIn.id.toString(),
          )

        const attachmentsId = checkInAttachments.map((checkInAttachment) => {
          return checkInAttachment.attachmentId.toString()
        })

        const attachments =
          await this.attachmentsRepository.findManyByIds(attachmentsId)

        if (attachments.length === 0) {
          throw new Error(`Attachments do not exist.`)
        }

        return CheckInDetails.create({
          checkInId: checkIn.id,
          parcelForwardingId: checkIn.parcelForwardingId,
          customerId: checkIn.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          packageId: checkIn.packageId,
          details: checkIn.details,
          status: checkIn.status,
          attachments,
          weight: checkIn.weight,
          createdAt: checkIn.createdAt,
          updatedAt: checkIn.updatedAt,
        })
      }),
    )

    return checkInsDetails
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

  async findManyRecentByParcelForwardingId(
    parcelForwardingId: string,
    page: number,
  ) {
    const checkIns = this.items
      .filter(
        (item) => item.parcelForwardingId.toString() === parcelForwardingId,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    const checkInDetails = await Promise.all(
      checkIns.map(async (checkIn) => {
        const customer = await this.customerRepository.findById(
          checkIn.customerId.toString(),
        )

        if (!customer) {
          throw new Error(
            `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
          )
        }

        return CheckInPreview.create({
          checkInId: checkIn.id,
          parcelForwardingId: checkIn.parcelForwardingId,
          customerId: checkIn.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          packageId: checkIn.packageId,
          status: checkIn.status,
          weight: checkIn.weight,
          createdAt: checkIn.createdAt,
          updatedAt: checkIn.updatedAt,
        })
      }),
    )

    return checkInDetails
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

  async findDetailsById(checkInId: string) {
    const checkIn = this.items.find((item) => item.id.toString() === checkInId)

    if (!checkIn) {
      return null
    }

    const customer = await this.customerRepository.findById(
      checkIn.customerId.toString(),
    )

    if (!customer) {
      throw new Error(
        `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
      )
    }

    const checkInAttachments =
      await this.checkInsAttachmentsRepository.findManyByCheckInId(
        checkIn.id.toString(),
      )

    const attachmentsId = checkInAttachments.map((checkInAttachment) => {
      return checkInAttachment.attachmentId.toString()
    })

    const attachments =
      await this.attachmentsRepository.findManyByIds(attachmentsId)

    if (attachments.length === 0) {
      throw new Error(`Attachments do not exist.`)
    }

    return CheckInDetails.create({
      checkInId: checkIn.id,
      parcelForwardingId: checkIn.parcelForwardingId,
      customerId: checkIn.customerId,
      hubId: customer.hubId,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      packageId: checkIn.packageId,
      details: checkIn.details,
      status: checkIn.status,
      attachments,
      weight: checkIn.weight,
      createdAt: checkIn.createdAt,
      updatedAt: checkIn.updatedAt,
    })
  }

  async findManyRecentCheckInsDetailsByParcelForwardingId(
    parcelForwardingId: string,
    page: number,
  ) {
    const checkIns = this.items
      .filter(
        (item) => item.parcelForwardingId.toString() === parcelForwardingId,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    const checkInsDetails = await Promise.all(
      checkIns.map(async (checkIn) => {
        const customer = await this.customerRepository.findById(
          checkIn.customerId.toString(),
        )

        if (!customer) {
          throw new Error(
            `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
          )
        }

        const checkInAttachments =
          await this.checkInsAttachmentsRepository.findManyByCheckInId(
            checkIn.id.toString(),
          )

        const attachmentsId = checkInAttachments.map((checkInAttachment) => {
          return checkInAttachment.attachmentId.toString()
        })

        const attachments =
          await this.attachmentsRepository.findManyByIds(attachmentsId)

        if (attachments.length === 0) {
          throw new Error(`Attachments do not exist.`)
        }

        return CheckInDetails.create({
          checkInId: checkIn.id,
          parcelForwardingId: checkIn.parcelForwardingId,
          customerId: checkIn.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          packageId: checkIn.packageId,
          details: checkIn.details,
          status: checkIn.status,
          attachments,
          weight: checkIn.weight,
          createdAt: checkIn.createdAt,
          updatedAt: checkIn.updatedAt,
        })
      }),
    )

    return checkInsDetails
  }
}
