import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Customer,
  CustomerProps,
} from '@/domain/customer/enterprise/entities/customer'
import { HubId } from '@/domain/customer/enterprise/entities/value-objects/hub-id'
import { faker } from '@faker-js/faker'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
) {
  const student = Customer.create(
    {
      parcelForwardingId: new UniqueEntityID(),
      hubId: HubId.create({
        parcelForwadingInitials: faker.string.fromCharacters('ABCDEF', 3),
        customerCode: faker.number.int(4),
      }),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}
