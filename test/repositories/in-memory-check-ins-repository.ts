import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import {
  CheckIn,
  CheckInStatus,
} from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { InMemoryCheckInsAttachmentsRepository } from './in-memory-check-ins-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'
import { InMemoryCustomerRepository } from './in-memory-customer-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { CheckInDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-details'
import { CheckInPreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview'
import { FilteredCheckInsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-ins'
import {
  CheckInStatusMetrics,
  StatusMetrics,
} from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-ins-status-metrics'
import { CheckInAttachmentDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-attachment-details'
import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  constructor(
    private checkInsAttachmentsRepository: InMemoryCheckInsAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private customerRepository: InMemoryCustomerRepository,
  ) {}

  async getMetricStatus(
    parcelForwardingId: string,
    metrics?: string[],
  ): Promise<CheckInStatusMetrics> {
    const checkIns = this.items.filter(
      (itens) => itens.parcelForwardingId.toString() === parcelForwardingId,
    )

    let metricsResponse: StatusMetrics = {}

    if (metrics && metrics.length > 0) {
      metricsResponse = metrics.reduce((acc, item) => {
        const counCheckInStatusFound = checkIns.filter(
          (checkIn) =>
            checkIn.status.toString().toLowerCase() ===
            item.toString().toLowerCase(),
        ).length

        return {
          ...acc,
          [item]: counCheckInStatusFound,
        }
      }, {} as StatusMetrics)
    } else {
      for (const status in CheckInStatus) {
        if (isNaN(Number(status))) {
          metricsResponse[status] = checkIns.filter((checkIn) =>
            checkIn.isStatus(Number(CheckInStatus[status])),
          ).length
        }
      }
    }

    return CheckInStatusMetrics.create(metricsResponse)

    /* This metrics type means that the key is the CheckInStatus enum 
    and the value is the number of check-ins with that status. Partial 
    means that the object can have any number of keys, but the keys
    must be of the CheckInStatus type. */
    /* Example of the metrics object:
    {
      RECEIVED: 3303,
      PENDING: 2,
      SHIPPED: 2948,
      DELIVERED: 2485,
      WITHDRAWN: 29,
      ABANDONED: 100,
      RETURNED: 7
    }
    */
  }

  async findManyCheckInsByFilter(
    parcelForwardingId: string,
    page: number,
    customersId: string[],
    checkInStatus?: CheckInStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<FilteredCheckInsData> {
    let filteredCheckIns = this.items.filter(
      (item) => item.parcelForwardingId.toString() === parcelForwardingId,
    )

    if (customersId.length > 0) {
      filteredCheckIns = filteredCheckIns.filter((checkIn) =>
        customersId.includes(checkIn.customerId.toString()),
      )
    }

    if (checkInStatus) {
      filteredCheckIns = filteredCheckIns.filter((checkIn) =>
        checkIn.isStatus(checkInStatus),
      )
    }

    if (startDate) {
      filteredCheckIns = filteredCheckIns.filter(
        (checkIn) => checkIn.createdAt >= startDate,
      )
    }
    if (endDate) {
      filteredCheckIns = filteredCheckIns.filter(
        (checkIn) => checkIn.createdAt <= endDate,
      )
    }

    const paginatedCheckIns = filteredCheckIns
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    const checkInsPreview = await Promise.all(
      paginatedCheckIns.map(async (checkIn) => {
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

    return FilteredCheckInsData.create({
      checkIns: checkInsPreview,
      meta: {
        pageIndex: page,
        perPage: 20,
        totalCount: filteredCheckIns.length,
      },
    })
  }

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

  async findManyCheckInsAttachmentDetailsByFilter(
    parcelForwardingId: string,
    page: number,
    customersId: string[],
    checkInStatus?: CheckInStatus,
    startDate?: Date,
    endDate?: Date,
  ) {
    let filteredCheckIns = this.items.filter(
      (item) => item.parcelForwardingId.toString() === parcelForwardingId,
    )

    if (customersId.length > 0) {
      filteredCheckIns = filteredCheckIns.filter((checkIn) =>
        customersId.includes(checkIn.customerId.toString()),
      )
    }

    if (checkInStatus) {
      filteredCheckIns = filteredCheckIns.filter((checkIn) =>
        checkIn.isStatus(checkInStatus),
      )
    }

    if (startDate) {
      filteredCheckIns = filteredCheckIns.filter(
        (checkIn) => checkIn.createdAt >= startDate,
      )
    }
    if (endDate) {
      filteredCheckIns = filteredCheckIns.filter(
        (checkIn) => checkIn.createdAt <= endDate,
      )
    }

    const checkInsAtt: CheckInAttachmentDetails[] = (
      await Promise.all(
        filteredCheckIns.map(async (checkIn) => {
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

          return attachments.map((att) =>
            CheckInAttachmentDetails.create({
              checkInId: checkIn.id,
              parcelForwardingId: checkIn.parcelForwardingId,
              customerId: checkIn.customerId,
              hubId: customer.hubId,
              customerFirstName: customer.firstName,
              customerLastName: customer.lastName,
              packageId: checkIn.packageId,
              details: checkIn.details,
              status: checkIn.status,
              attachment: att,
              weight: checkIn.weight,
              createdAt: checkIn.createdAt,
              updatedAt: checkIn.updatedAt,
            }),
          )
        }),
      )
    ).flat()

    const paginatedCheckInAttachments = checkInsAtt.slice(
      (page - 1) * 20,
      page * 20,
    )

    return FilteredCheckInAttachmentsData.create({
      checkInsAttachments: paginatedCheckInAttachments,
      meta: {
        pageIndex: page,
        perPage: 20,
        totalCount: filteredCheckIns.length,
      },
    })
  }
}
