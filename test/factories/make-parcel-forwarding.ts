import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ParcelForwarding,
  ParcelForwardingProps,
} from '@/domain/parcel-forwarding/enterprise/entities/parcel-forwarding'
import { PrismaParcelForwardingMapper } from '@/infra/database/prisma/mappers/prisma-parcel-forwarding-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeParcelForwarding(
  override: Partial<ParcelForwardingProps> = {},
  id?: UniqueEntityID,
) {
  const student = ParcelForwarding.create(
    {
      name: faker.company.buzzNoun(),
      initials: faker.string.fromCharacters('ABCDEF', 3),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}

@Injectable()
export class ParcelForwardingFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaParcelForwarding(
    data: Partial<ParcelForwardingProps> = {},
  ): Promise<ParcelForwarding> {
    const parcelForwarding = makeParcelForwarding(data)

    await this.prisma.parcelForwarding.create({
      data: PrismaParcelForwardingMapper.toPrisma(parcelForwarding),
    })

    return parcelForwarding
  }
}
