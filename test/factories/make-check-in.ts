import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CheckIn,
  CheckInProps,
} from '@/domain/parcel-forwarding/enterprise/entities/check-in'
import { faker } from '@faker-js/faker'

export function makeCheckIn(
  override: Partial<CheckInProps> = {},
  id?: UniqueEntityID,
) {
  const checkin = CheckIn.create(
    {
      parcelForwardingId: new UniqueEntityID(),
      customerId: new UniqueEntityID(),
      details: faker.lorem.text(),
      weight: faker.number.float(),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return checkin
}
