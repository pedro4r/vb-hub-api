import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeclarationModelItemsRepository } from '@/domain/customer/application/repositories/declaration-model-item-repository'
import { DeclarationModelItem } from '@/domain/customer/enterprise/entities/declaration-model-item'
import { PrismaDeclarationModelItemsMapper } from '../mappers/prisma-declaration-model-items-mapper'

@Injectable()
export class PrismaDeclarationModelItemsRepository
  implements DeclarationModelItemsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(declarationModelItems: DeclarationModelItem[]) {
    await Promise.all(
      declarationModelItems.map((item, index) => {
        const itemData = PrismaDeclarationModelItemsMapper.toPrisma(item, index)
        return this.prisma.declarationModelItem.create({
          data: itemData,
        })
      }),
    )
  }

  async findManyByDeclarationModelId(declarationModelId: string) {
    const declarationModelItems =
      await this.prisma.declarationModelItem.findMany({
        where: {
          declarationModelId,
        },
      })

    return declarationModelItems.map(PrismaDeclarationModelItemsMapper.toDomain)
  }

  async deleteMany(declarationModelItems: DeclarationModelItem[]) {
    const declarationModelItemsIds = declarationModelItems.map((item) => {
      return item.id.toString()
    })

    await this.prisma.declarationModelItem.deleteMany({
      where: {
        id: {
          in: declarationModelItemsIds,
        },
      },
    })
  }

  async deleteManyByDeclarationModelId(declarationModelId: string) {
    await this.prisma.declarationModelItem.deleteMany({
      where: {
        declarationModelId,
      },
    })
  }
}
