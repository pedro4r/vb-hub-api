import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ParcelForwarding } from '@/domain/parcel-forwarding/enterprise/entities/parcel-forwarding'
import { PrismaParcelForwardingMapper } from '../mappers/prisma-parcel-forwarding-mapper'
import {
  ParcelForwardingsRepository,
  UpdatePasswordParams,
} from '@/domain/parcel-forwarding/application/repositories/parcel-forwardings-repository'

@Injectable()
export class PrismaParcelForwardingRepository
  implements ParcelForwardingsRepository
{
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<ParcelForwarding | null> {
    const parcelForwarding = await this.prisma.parcelForwarding.findUnique({
      where: {
        id,
      },
    })

    if (!parcelForwarding) {
      return null
    }

    return PrismaParcelForwardingMapper.toDomain(parcelForwarding)
  }

  async findByEmail(email: string): Promise<ParcelForwarding | null> {
    const parcelForwarding = await this.prisma.parcelForwarding.findUnique({
      where: {
        email,
      },
    })

    if (!parcelForwarding) {
      return null
    }

    return PrismaParcelForwardingMapper.toDomain(parcelForwarding)
  }

  async create(parcelforwarding: ParcelForwarding): Promise<void> {
    const data = PrismaParcelForwardingMapper.toPrisma(parcelforwarding)

    await this.prisma.parcelForwarding.create({
      data,
    })
  }

  async updatePassword(data: UpdatePasswordParams): Promise<void> {
    await this.prisma.parcelForwarding.update({
      where: {
        email: data.email,
      },
      data: {
        password: data.newPassword,
      },
    })
  }
}
