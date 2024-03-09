import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ParcelForwarding } from '@/domain/parcel-forwarding/enterprise/entities/parcel-forwarding'
import {
  Prisma,
  ParcelForwarding as PrismaParcelForwarding,
} from '@prisma/client'

export class PrismaParcelForwardingMapper {
  static toDomain(raw: PrismaParcelForwarding): ParcelForwarding {
    return ParcelForwarding.create(
      {
        name: raw.name,
        initials: raw.initials,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    parcelForwarding: ParcelForwarding,
  ): Prisma.ParcelForwardingUncheckedCreateInput {
    return {
      id: parcelForwarding.id.toString(),
      name: parcelForwarding.name,
      initials: parcelForwarding.initials,
      email: parcelForwarding.email,
      password: parcelForwarding.password,
    }
  }
}
