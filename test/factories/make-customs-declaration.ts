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
  const customsDeclaration = CustomsDeclaration.create(
    {
      customerId: new UniqueEntityID(),
      title: faker.lorem.words(3),
      ...override,
    },
    id,
  )

  return customsDeclaration
}
