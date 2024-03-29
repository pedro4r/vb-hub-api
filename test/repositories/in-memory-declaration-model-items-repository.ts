import { DeclarationModelItemsRepository } from '@/domain/customer/application/repositories/declaration-model-item-repository'
import { DeclarationModelItem } from '@/domain/customer/enterprise/entities/declaration-model-item'

export class InMemoryDeclarationModelItemsRepository
  implements DeclarationModelItemsRepository
{
  public items: DeclarationModelItem[] = []

  async findManyByDeclarationModelId(declarationModelId: string) {
    const declarationModelItems = this.items.filter(
      (item) => item.declarationModelId?.toString() === declarationModelId,
    )

    return declarationModelItems
  }

  async deleteMany(declarationModelItems: DeclarationModelItem[]) {
    const newDeclarationModelItems = this.items.filter((item) => {
      return !declarationModelItems.some((declarationItem) =>
        declarationItem.equals(item),
      )
    })

    this.items = newDeclarationModelItems
  }

  async deleteManyByDeclarationModelId(declarationModelId: string) {
    const declarationModelItems = this.items.filter(
      (item) => item.declarationModelId?.toString() !== declarationModelId,
    )

    this.items = declarationModelItems
  }

  async createMany(
    declarationModelItem: DeclarationModelItem[],
  ): Promise<void> {
    this.items.push(...declarationModelItem)
  }
}
