import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeclarationModelRepository } from '@/domain/customer/application/repositories/declaration-model-repository'
import { DeclarationModel } from '@/domain/customer/enterprise/entities/declaration-model'
import { PrismaDeclarationModelMapper } from '../mappers/prisma-declaration-model-mapper'
import { DeclarationModelItemsRepository } from '@/domain/customer/application/repositories/declaration-model-item-repository'

@Injectable()
export class PrismaDeclarationModelsRepository
  implements DeclarationModelRepository
{
  constructor(
    private prisma: PrismaService,
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
  ) {}

  async create(declarationModel: DeclarationModel) {
    const declarationModelData =
      PrismaDeclarationModelMapper.toPrisma(declarationModel)

    await this.prisma.declarationModel.create({
      data: declarationModelData,
    })

    await this.declarationModelItemsRepository.createMany(
      declarationModel.items.getItems(),
    )
  }

  async findById(id: string) {
    const declarationModel = await this.prisma.declarationModel.findUnique({
      where: {
        id,
      },
    })

    if (!declarationModel) {
      return null
    }

    return PrismaDeclarationModelMapper.toDomain(declarationModel)
  }

  async findManyByCustomerId(customerId: string) {
    const declarationModels = await this.prisma.declarationModel.findMany({
      where: {
        customerId,
      },
    })

    return declarationModels.map(PrismaDeclarationModelMapper.toDomain)
  }

  async save(declarationModel: DeclarationModel) {
    await this.prisma.declarationModel.update({
      where: {
        id: declarationModel.id.toString(),
      },
      data: {
        title: declarationModel.title,
      },
    })

    await this.declarationModelItemsRepository.deleteMany(
      declarationModel.items.getRemovedItems(),
    )

    await this.declarationModelItemsRepository.createMany(
      declarationModel.items.getNewItems(),
    )
  }

  async delete(declarationModel: DeclarationModel) {
    await this.declarationModelItemsRepository.deleteManyByDeclarationModelId(
      declarationModel.id.toString(),
    )

    await this.prisma.declarationModel.delete({
      where: {
        id: declarationModel.id.toString(),
      },
    })
  }
}
