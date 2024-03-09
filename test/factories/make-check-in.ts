import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CheckIn,
  CheckInProps,
} from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { PrismaCheckInMapper } from '@/infra/database/prisma/mappers/prisma-check-in-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCheckIn(
  override: Partial<CheckInProps> = {},
  id?: UniqueEntityID,
) {
  const checkin = CheckIn.create(
    {
      parcelForwardingId: new UniqueEntityID(),
      customerId: new UniqueEntityID(),
      status: faker.number.int({ min: 1, max: 7 }),
      details: faker.lorem.text(),
      weight: faker.number.float(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return checkin
}
@Injectable()
export class CheckInFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCheckIn(data: Partial<CheckInProps> = {}): Promise<CheckIn> {
    const checkIn = makeCheckIn(data)

    await this.prisma.checkIn.create({
      data: PrismaCheckInMapper.toPrisma(checkIn),
    })

    return checkIn
  }
}
