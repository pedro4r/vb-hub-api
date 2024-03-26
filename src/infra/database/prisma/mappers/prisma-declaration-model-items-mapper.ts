import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeclarationModelItem } from '@/domain/customer/enterprise/entities/declaration-model-item'
import {
  Prisma,
  DeclarationModelItem as PrismaDeclarationModelItem,
} from '@prisma/client'

export class PrismaDeclarationModelItemsMapper {
  static toDomain(raw: PrismaDeclarationModelItem): DeclarationModelItem {
    return DeclarationModelItem.create(
      {
        declarationModelId: new UniqueEntityID(raw.declarationModelId),
        description: raw.description,
        value: raw.value,
        quantity: raw.quantity,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    declarationModelItem: DeclarationModelItem,
    index: number,
  ): Prisma.DeclarationModelItemUncheckedCreateInput {
    const currentDate = new Date()
    // index is used to create a unique createdAt date
    // and respect the order of the items in the array
    return {
      id: declarationModelItem.id.toString(),
      declarationModelId: declarationModelItem.declarationModelId.toString(),
      description: declarationModelItem.description,
      value: declarationModelItem.value,
      quantity: declarationModelItem.quantity,
      createdAt: new Date(currentDate.getTime() + index),
    }
  }
}
