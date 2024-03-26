import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeclarationModel,
  DeclarationModelProps,
} from '@/domain/customer/enterprise/entities/declaration-model'

import { faker } from '@faker-js/faker'
import { makeDeclarationModelItem } from './make-declaration-model-item'
import { DeclarationModelList } from '@/domain/customer/enterprise/entities/declaration-model-list'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDeclarationModelMapper } from '@/infra/database/prisma/mappers/prisma-declaration-model-mapper'
import { PrismaDeclarationModelItemsMapper } from '@/infra/database/prisma/mappers/prisma-declaration-model-items-mapper'

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

@Injectable()
export class DeclarationModelWithItemsFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeclarationModel(
    data: Partial<DeclarationModelProps> = {},
  ): Promise<DeclarationModel> {
    const declarationModel = makeDeclarationModelWithItems(data)

    await this.prisma.declarationModel.create({
      data: PrismaDeclarationModelMapper.toPrisma(declarationModel),
    })

    const declarationModelItems = declarationModel.items.getItems()

    await this.prisma.declarationModelItem.createMany({
      data: declarationModelItems.map((item, index) =>
        PrismaDeclarationModelItemsMapper.toPrisma(item, index),
      ),
    })

    return declarationModel
  }
}
