import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CustomsDeclaration,
  CustomsDeclarationProps,
} from '@/domain/customer/enterprise/entities/customs-declaration'
import { faker } from '@faker-js/faker'

export function makeCustomsDeclaration(
  override: Partial<CustomsDeclarationProps> = {},
  id?: UniqueEntityID,
) {
  const checkin = CustomsDeclaration.create(
    {
      customerId: new UniqueEntityID(),
      packageId: new UniqueEntityID(),
      itemsList: [
        {
          description: faker.lorem.text(),
          quantity: faker.number.int(),
          value: faker.number.int(),
        },
        {
          description: faker.lorem.text(),
          quantity: faker.number.int(),
          value: faker.number.int(),
        },
      ],
      ...override,
    },
    id,
  )

  return checkin
}
