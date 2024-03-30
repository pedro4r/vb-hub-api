import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { Prisma, CheckIn as PrismaCheckIn } from '@prisma/client'

export class PrismaCheckInMapper {
  static toDomain(raw: PrismaCheckIn): CheckIn {
    return CheckIn.create(
      {
        parcelForwardingId: new UniqueEntityID(raw.parcelForwardingId),
        customerId: new UniqueEntityID(raw.customerId),
        status: raw.status,
        details: raw.details,
        weight: raw.weight,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(checkIn: CheckIn): Prisma.CheckInUncheckedCreateInput {
    return {
      id: checkIn.id.toString(),
      status: checkIn.getStatusAsCode(),
      parcelForwardingId: checkIn.parcelForwardingId.toString(),
      customerId: checkIn.customerId.toString(),
      packageId: checkIn.packageId?.toString(),
      details: checkIn.details,
      weight: checkIn.weight,
      createdAt: checkIn.createdAt,
      updatedAt: checkIn.updatedAt,
    }
  }
}
