import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { Injectable } from '@nestjs/common'
import { PrismaCheckInMapper } from '../mappers/prisma-check-in-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCheckInsRepository implements CheckInsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyRecent(parcelForwardingId: string, page: number) {
    const checkIns = await this.prisma.checkIn.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        parcel_forwarding_id: parcelForwardingId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns.map(PrismaCheckInMapper.toDomain)
  }

  async create(checkIn: CheckIn) {
    const data = PrismaCheckInMapper.toPrisma(checkIn)

    await this.prisma.checkIn.create({
      data,
    })
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
  }

  async delete(checkIn: CheckIn): Promise<void> {
    const data = PrismaCheckInMapper.toPrisma(checkIn)

    await this.prisma.checkIn.delete({
      where: {
        id: data.id,
      },
    })
  }
}
