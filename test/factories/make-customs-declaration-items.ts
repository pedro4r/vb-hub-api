import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeclarationModelItem } from './make-declaration-model-item'
import { CustomsDeclarationItem } from '@/domain/customer/enterprise/entities/customs-declaration-item'

export function makeCustomsDeclarationItems(
  packageId: UniqueEntityID,
): CustomsDeclarationItem[] {
  const declarationModelItems = [
    makeDeclarationModelItem({
      declarationModelId: new UniqueEntityID('declaration-model-id'),
    }),
    makeDeclarationModelItem({
      declarationModelId: new UniqueEntityID('declaration-model-id'),
    }),
    makeDeclarationModelItem({
      declarationModelId: new UniqueEntityID('declaration-model-id'),
    }),
  ]

  const customsDeclarationItems = declarationModelItems.map(
    (declarationModelItem) => {
      return CustomsDeclarationItem.create({
        packageId,
        description: declarationModelItem.description,
        value: declarationModelItem.value,
        quantity: declarationModelItem.quantity,
      })
    },
  )

  return customsDeclarationItems
}
