import { CustomsDeclarationItemsRepository } from '@/domain/customer/application/repositories/customs-declaration-item-repository'
import { CustomsDeclarationItem } from '@/domain/customer/enterprise/entities/customs-declaration-item'

export class InMemoryCustomsDeclarationItemsRepository
  implements CustomsDeclarationItemsRepository
{
  public items: CustomsDeclarationItem[] = []

  async findManyByCustomsDeclarationId(customsDeclarationId: string) {
    const customsDeclarationItems = this.items.filter(
      (item) => item.customsDeclarationId?.toString() === customsDeclarationId,
    )

    if (!customsDeclarationItems.length) {
      return null
    }

    return customsDeclarationItems
  }

  async deleteMany(customsDeclarationItems: CustomsDeclarationItem[]) {
    const newCustomsDeclarationItems = this.items.filter((item) => {
      return !customsDeclarationItems.some((declarationItem) =>
        declarationItem.equals(item),
      )
    })

    this.items = newCustomsDeclarationItems
  }

  async createMany(
    customsDeclarationItem: CustomsDeclarationItem[],
  ): Promise<void> {
    this.items.push(...customsDeclarationItem)
  }
}
