import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeclarationModelItem,
  DeclarationModelItemProps,
} from '@/domain/customer/enterprise/entities/declaration-model-item'

import { faker } from '@faker-js/faker'

export function makeDeclarationModelItem(
  override: Partial<DeclarationModelItemProps> = {},
  id?: UniqueEntityID,
) {
  const declarationModelItem = DeclarationModelItem.create(
    {
      declarationModelId: new UniqueEntityID(),
      description: faker.lorem.words(3),
      value: faker.number.int({ min: 1, max: 1000 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      ...override,
    },
    id,
  )

  return declarationModelItem
}
