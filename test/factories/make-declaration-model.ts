import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeclarationModel,
  DeclarationModelProps,
} from '@/domain/customer/enterprise/entities/declaration-model'

import { faker } from '@faker-js/faker'

export function makeDeclarationModel(
  override: Partial<DeclarationModelProps> = {},
  id?: UniqueEntityID,
) {
  const declarationModel = DeclarationModel.create(
    {
      customerId: new UniqueEntityID(),
      title: faker.lorem.words(3),
      ...override,
    },
    id,
  )

  return declarationModel
}
