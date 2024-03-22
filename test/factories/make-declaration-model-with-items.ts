import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeclarationModel,
  DeclarationModelProps,
} from '@/domain/customer/enterprise/entities/declaration-model'

import { faker } from '@faker-js/faker'
import { makeDeclarationModelItem } from './make-declaration-model-item'
import { DeclarationModelList } from '@/domain/customer/enterprise/entities/declaration-model-list'

export function makeDeclarationModelWithItems(
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

  const declarationModelsItems = [
    makeDeclarationModelItem({
      description: 'Item 1',
      declarationModelId: declarationModel.id,
    }),
    makeDeclarationModelItem({
      description: 'Item 2',
      declarationModelId: declarationModel.id,
    }),
    makeDeclarationModelItem({
      description: 'Item 3',
      declarationModelId: declarationModel.id,
    }),
  ]

  declarationModel.items = new DeclarationModelList(declarationModelsItems)

  return declarationModel
}
