import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import {
  CheckIn,
  CheckInStatus,
} from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { Injectable } from '@nestjs/common'
import { PrismaCheckInMapper } from '../mappers/prisma-check-in-mapper'
import { PrismaService } from '../prisma.service'
import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'
import { CheckInAttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/check-in-attachments-repository'
import { CheckInDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-details'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckInPreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview'
import { DomainEvents } from '@/core/events/domain-events'
import { FilteredCheckInsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-ins'
import {
  CheckInStatusMetrics,
  StatusMetrics,
} from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-ins-status-metrics'
import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'
import { CheckInAttachmentDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-attachment-details'

@Injectable()
export class PrismaCheckInsRepository implements CheckInsRepository {
  constructor(
    private prisma: PrismaService,
    private checkInAttachmentsRepository: CheckInAttachmentsRepository,
  ) {}

  async getMetricStatus(
    parcelForwardingId: string,
    metrics?: string[],
  ): Promise<CheckInStatusMetrics> {
    let metricsResponse: StatusMetrics = {}

    if (metrics && metrics.length > 0) {
      //
      const metricInStatusCodeArray = metrics.reduce((acc, item) => {
        return [...acc, CheckInStatus[item.toUpperCase()]]
      }, [] as number[])

      const statusCounts2 = await this.prisma.checkIn.groupBy({
        where: {
          parcelForwardingId,
          status: {
            in: metricInStatusCodeArray,
          },
        },
        by: ['status'],
        _count: {
          status: true,
        },
      })

      metricsResponse = metrics.reduce((acc, statusKey) => {
        const foundMetrics = statusCounts2.find(
          (item) =>
            CheckInStatus[item.status].toString().toLocaleLowerCase() ===
            statusKey,
        )

        return {
          ...acc,
          [statusKey]: foundMetrics ? foundMetrics._count.status : 0,
        }
      }, {})
    } else {
      const statusCounts = await this.prisma.checkIn.groupBy({
        where: {
          parcelForwardingId,
        },
        by: ['status'],
        _count: {
          status: true,
        },
      })

      /* Format the counts, like this:
      [
        { status: 3, count: 45,
        ...
      ]
      */
      const formattedCounts = statusCounts.map((item) => ({
        status: item.status,
        count: item._count.status,
      }))

      metricsResponse = Object.values(CheckInStatus).reduce(
        (acc, statusCode) => {
          if (isFinite(Number(statusCode))) {
            /* Find the status code in the formatted counts
          because not all status codes will have a count */
            const checkInStatus = formattedCounts.find(
              (item) => item.status === statusCode,
            )
            // Get the key for the status code
            const statusKey = CheckInStatus[statusCode]

            // If the status code was found, add it to the metrics, otherwise add 0
            acc[statusKey] = checkInStatus ? checkInStatus.count : 0
            return acc
          }

          return acc
        },
        {} as StatusMetrics,
      )
    }

    return CheckInStatusMetrics.create(metricsResponse)
  }

  async findManyCheckInsByFilter(
    parcelForwardingId: string,
    page: number,
    customersId?: string[],
    checkInStatus?: CheckInStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<FilteredCheckInsData> {
    const totalCheckIns = await this.prisma.checkIn.count({
      where: {
        parcelForwardingId,
        customerId: customersId?.length
          ? {
              in: customersId,
            }
          : undefined,
        status: checkInStatus ?? undefined, // Inclui apenas se definido
        createdAt:
          startDate || endDate
            ? {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              }
            : undefined,
      },
    })

    const checkIns = await this.prisma.checkIn.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        parcelForwardingId,
        customerId: customersId?.length
          ? {
              in: customersId,
            }
          : undefined,
        status: checkInStatus ?? undefined, // Inclui apenas se definido
        createdAt:
          startDate || endDate
            ? {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              }
            : undefined,
      },
      take: 8,
      skip: (page - 1) * 8,
    })

    // transform checkIns to CheckInPreview
    const checkInsPreview = await Promise.all(
      checkIns.map(async (checkIn) => {
        const customer = await this.prisma.customer.findUnique({
          where: {
            id: checkIn.customerId.toString(),
          },
        })

        if (!customer) {
          throw new ResourceNotFoundError(
            `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
          )
        }

        const checkInDomain = PrismaCheckInMapper.toDomain(checkIn)

        return CheckInPreview.create({
          checkInId: checkInDomain.id,
          parcelForwardingId: checkInDomain.parcelForwardingId,
          customerId: checkInDomain.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          packageId: checkInDomain.packageId,
          status: checkInDomain.status,
          weight: checkInDomain.weight,
          createdAt: checkInDomain.createdAt,
          updatedAt: checkInDomain.updatedAt,
        })
      }),
    )

    return FilteredCheckInsData.create({
      checkIns: checkInsPreview,
      meta: {
        pageIndex: page,
        perPage: 8,
        totalCount: totalCheckIns,
      },
    })
  }

  async findManyWithDetailsByPackageId(
    packadeId: string,
    page: number,
  ): Promise<CheckInDetails[]> {
    const checkIns = await this.prisma.checkIn.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        packageId: packadeId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const checkInDetails = await Promise.all(
      checkIns.map(async (checkIn) => {
        const customer = await this.prisma.customer.findUnique({
          where: {
            id: checkIn.customerId.toString(),
          },
        })

        if (!customer) {
          throw new ResourceNotFoundError(
            `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
          )
        }

        const checkInAttachments = await this.prisma.checkInAttachment.findMany(
          {
            where: {
              checkInId: checkIn.id,
            },
          },
        )

        const attachmentsId = checkInAttachments.map((checkInAttachment) => {
          return checkInAttachment.attachmentId.toString()
        })

        const attachments = await this.prisma.attachment.findMany({
          where: {
            id: {
              in: attachmentsId,
            },
          },
        })

        if (attachments.length === 0) {
          throw new Error(`Attachments do not exist.`)
        }

        const attachmentsDomain = attachments.map(
          PrismaAttachmentMapper.toDomain,
        )
        const checkInDomain = PrismaCheckInMapper.toDomain(checkIn)

        return CheckInDetails.create({
          checkInId: checkInDomain.id,
          parcelForwardingId: checkInDomain.parcelForwardingId,
          customerId: checkInDomain.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          packageId: checkInDomain.packageId,
          details: checkInDomain.details,
          status: checkInDomain.status,
          attachments: attachmentsDomain,
          weight: checkInDomain.weight,
          createdAt: checkInDomain.createdAt,
          updatedAt: checkInDomain.updatedAt,
        })
      }),
    )

    return checkInDetails
  }

  async findManyByPackageId(packadeId: string) {
    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        packageId: packadeId,
      },
    })

    return checkIns.map(PrismaCheckInMapper.toDomain)
  }

  async linkManyCheckInToPackage(checkIns: PackageCheckIn[]) {
    await Promise.all(
      checkIns.map((checkIn) => {
        return this.prisma.checkIn.update({
          where: {
            id: checkIn.checkInId.toString(),
          },
          data: {
            packageId: checkIn.packageId.toString(),
          },
        })
      }),
    )
  }

  async unlinkManyCheckInToPackage(checkIns: PackageCheckIn[]) {
    await Promise.all(
      checkIns.map((checkIn) => {
        return this.prisma.checkIn.update({
          where: {
            id: checkIn.checkInId.toString(),
          },
          data: {
            packageId: null,
          },
        })
      }),
    )
  }

  async findManyRecentByParcelForwardingId(
    parcelForwardingId: string,
    page: number,
  ) {
    const checkIns = await this.prisma.checkIn.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        parcelForwardingId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const checkInsPreview = await Promise.all(
      checkIns.map(async (checkIn) => {
        const customer = await this.prisma.customer.findUnique({
          where: {
            id: checkIn.customerId.toString(),
          },
        })

        if (!customer) {
          throw new ResourceNotFoundError(
            `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
          )
        }

        const checkInDomain = PrismaCheckInMapper.toDomain(checkIn)

        return CheckInPreview.create({
          checkInId: checkInDomain.id,
          parcelForwardingId: checkInDomain.parcelForwardingId,
          customerId: checkInDomain.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          packageId: checkInDomain.packageId,
          status: checkInDomain.status,
          weight: checkInDomain.weight,
          createdAt: checkInDomain.createdAt,
          updatedAt: checkInDomain.updatedAt,
        })
      }),
    )

    return checkInsPreview
  }

  async create(checkIn: CheckIn) {
    const data = PrismaCheckInMapper.toPrisma(checkIn)

    await this.prisma.checkIn.create({
      data,
    })

    await this.checkInAttachmentsRepository.createMany(
      checkIn.attachments.getItems(),
    )
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await this.prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    if (!checkIn) {
      return null
    }

    return PrismaCheckInMapper.toDomain(checkIn)
  }

  async save(checkIn: CheckIn) {
    const data = PrismaCheckInMapper.toPrisma(checkIn)

    await this.prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    await this.checkInAttachmentsRepository.createMany(
      checkIn.attachments.getNewItems(),
    )

    await this.checkInAttachmentsRepository.deleteMany(
      checkIn.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(checkIn.id)
  }

  async delete(checkIn: CheckIn): Promise<void> {
    const data = PrismaCheckInMapper.toPrisma(checkIn)

    await this.checkInAttachmentsRepository.deleteManyByCheckInId(data.id!)

    await this.prisma.checkIn.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findDetailsById(checkInId: string): Promise<CheckInDetails | null> {
    const checkIn = await this.prisma.checkIn.findUnique({
      where: {
        id: checkInId,
      },
    })

    if (!checkIn) {
      return null
    }

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: checkIn.customerId,
      },
    })

    if (!customer) {
      throw new Error(
        `Customer with ID "${checkIn.customerId.toString()}" does not exist.`,
      )
    }

    const checkInAttachments = await this.prisma.checkInAttachment.findMany({
      where: {
        checkInId: checkIn.id,
      },
    })

    const attachmentsId = checkInAttachments.map((checkInAttachment) => {
      return checkInAttachment.attachmentId.toString()
    })

    const attachments = await this.prisma.attachment.findMany({
      where: {
        id: {
          in: attachmentsId,
        },
      },
    })

    if (attachments.length === 0) {
      throw new Error(`Attachments do not exist.`)
    }

    const attachmentsDomain = attachments.map(PrismaAttachmentMapper.toDomain)
    const checkInDomain = PrismaCheckInMapper.toDomain(checkIn)

    return CheckInDetails.create({
      checkInId: checkInDomain.id,
      parcelForwardingId: checkInDomain.parcelForwardingId,
      customerId: checkInDomain.customerId,
      hubId: customer.hubId,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      packageId: checkInDomain.packageId,
      details: checkInDomain.details,
      status: checkInDomain.status,
      attachments: attachmentsDomain,
      weight: checkInDomain.weight,
      createdAt: checkInDomain.createdAt,
      updatedAt: checkInDomain.updatedAt,
    })
  }

  async findManyCheckInsAttachmentDetailsByFilter(
    parcelForwardingId: string,
    page: number,
    customersId?: string[],
    checkInStatus?: CheckInStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<FilteredCheckInAttachmentsData> {
    const totalCheckInAttachments = await this.prisma.checkInAttachment.count({
      where: {
        CheckIn: {
          parcelForwardingId,
          customerId: customersId?.length ? { in: customersId } : undefined,
          status: checkInStatus ?? undefined,
          createdAt:
            startDate || endDate
              ? {
                  ...(startDate ? { gte: startDate } : {}),
                  ...(endDate ? { lte: endDate } : {}),
                }
              : undefined,
        },
      },
    })

    const checkInAttachments = await this.prisma.checkInAttachment.findMany({
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }, // Critério secundário para desempate
      ],
      where: {
        CheckIn: {
          parcelForwardingId,
          customerId: customersId?.length ? { in: customersId } : undefined,
          status: checkInStatus ?? undefined,
          createdAt:
            startDate || endDate
              ? {
                  ...(startDate ? { gte: startDate } : {}),
                  ...(endDate ? { lte: endDate } : {}),
                }
              : undefined,
        },
      },
      take: 30,
      skip: (page - 1) * 30, // Retorna apenas os 30 primeiros attachments
      include: {
        Attachment: true, // Inclui os dados da tabela `attachments`
        CheckIn: {
          include: {
            customer: true,
          },
        },
      },
    })

    const checkInsAttachmentsDetails = await Promise.all(
      checkInAttachments.map(async (checkInAttachment) => {
        const attachmentDomain = PrismaAttachmentMapper.toDomain(
          checkInAttachment.Attachment,
        )

        const customer = await this.prisma.customer.findUnique({
          where: {
            id: checkInAttachment.CheckIn.customerId.toString(),
          },
        })

        if (!customer) {
          throw new ResourceNotFoundError(
            `Customer with ID "${checkInAttachment.CheckIn.customerId.toString()}" does not exist.`,
          )
        }

        const checkInDomain = PrismaCheckInMapper.toDomain(
          checkInAttachment.CheckIn,
        )

        return CheckInAttachmentDetails.create({
          checkInId: checkInDomain.id,
          parcelForwardingId: checkInDomain.parcelForwardingId,
          customerId: checkInDomain.customerId,
          hubId: customer.hubId,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          packageId: checkInDomain.packageId,
          details: checkInDomain.details,
          status: checkInDomain.status,
          attachment: attachmentDomain,
          weight: checkInDomain.weight,
          createdAt: checkInDomain.createdAt,
          updatedAt: checkInDomain.updatedAt,
        })
      }),
    )

    return FilteredCheckInAttachmentsData.create({
      checkInsAttachments: checkInsAttachmentsDetails,
      meta: {
        pageIndex: page,
        perPage: 30,
        totalCount: totalCheckInAttachments,
      },
    })
  }
}
