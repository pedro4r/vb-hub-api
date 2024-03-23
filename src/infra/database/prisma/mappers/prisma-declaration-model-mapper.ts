import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeclarationModel } from '@/domain/customer/enterprise/entities/declaration-model'
import {
  Prisma,
  DeclarationModel as PrismaDeclarationModel,
} from '@prisma/client'

export class PrismaDeclarationModelMapper {
  static toDomain(raw: PrismaDeclarationModel): DeclarationModel {
    return DeclarationModel.create(
      {
        title: raw.title,
        customerId: new UniqueEntityID(raw.customerId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    declarationModel: DeclarationModel,
  ): Prisma.DeclarationModelUncheckedCreateInput {
    return {
      id: declarationModel.id.toString(),
      title: declarationModel.title,
      customerId: declarationModel.customerId.toString(),
    }
  }
}
