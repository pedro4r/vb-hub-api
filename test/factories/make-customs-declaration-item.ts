import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CustomsDeclarationItem,
  CustomsDeclarationItemProps,
} from '@/domain/customer/enterprise/entities/customs-declaration-item'
import { faker } from '@faker-js/faker'

export function makeCustomsDeclarationItem(
  override: Partial<CustomsDeclarationItemProps> = {},
  id?: UniqueEntityID,
) {
  const customsDeclarationItem = CustomsDeclarationItem.create(
    {
      customsDeclarationId: new UniqueEntityID(),
      description: faker.lorem.words(3),
      value: faker.number.int({ min: 1, max: 1000 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      ...override,
    },
    id,
  )

  return customsDeclarationItem
}
