import { DeclarationModelItemsRepository } from '@/domain/customer/application/repositories/declaration-model-item-repository'
import { DeclarationModelRepository } from '@/domain/customer/application/repositories/declaration-model-repository'
import { DeclarationModel } from '@/domain/customer/enterprise/entities/declaration-model'

export class InMemoryDeclarationModelsRepository
  implements DeclarationModelRepository
{
  public items: DeclarationModel[] = []

  constructor(
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
  ) {}

  async findManyByCustomerId(customerId: string) {
    const declarationModels = this.items.filter(
      (item) => item.customerId.toString() === customerId,
    )

    if (!declarationModels) {
      return null
    }

    return declarationModels
  }

  async delete(declarationModel: DeclarationModel) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(declarationModel.id),
    )

    this.items.splice(itemIndex, 1)

    await this.declarationModelItemsRepository.deleteMany(
      declarationModel.items.getItems(),
    )
  }

  async findById(declarationModelId: string) {
    const declarationModel = this.items.find(
      (item) => item.id.toString() === declarationModelId,
    )
    if (!declarationModel) {
      return null
    }

    return declarationModel
  }

  async save(declarationModel: DeclarationModel): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(declarationModel.id),
    )

    this.items[itemIndex] = declarationModel

    await this.declarationModelItemsRepository.createMany(
      declarationModel.items.getNewItems(),
    )

    await this.declarationModelItemsRepository.deleteMany(
      declarationModel.items.getRemovedItems(),
    )
  }

  async create(declarationModel: DeclarationModel) {
    this.items.push(declarationModel)

    await this.declarationModelItemsRepository.createMany(
      declarationModel.items.getItems(),
    )
  }
}
