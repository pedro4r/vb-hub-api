import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'
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

@Injectable()
export class PrismaCheckInsRepository implements CheckInsRepository {
  constructor(
    private prisma: PrismaService,
    private checkInAttachmentsRepository: CheckInAttachmentsRepository,
  ) {}

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

    return checkInDetails
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

  async findManyRecentCheckInsDetailsByParcelForwardingId(
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

    const checkInsDetails = await Promise.all(
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

    return checkInsDetails
  }
}
