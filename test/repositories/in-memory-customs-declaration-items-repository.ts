import { CustomsDeclarationItemsRepository } from '@/domain/customer/application/repositories/customs-declaration-items-repository'
import { CustomsDeclarationItem } from '@/domain/customer/enterprise/entities/customs-declaration-item'

export class InMemoryCustomsDeclarationItemsRepository
  implements CustomsDeclarationItemsRepository
{
  public items: CustomsDeclarationItem[] = []

  async findManyByPackageId(packageId: string) {
    const customsDeclarationItems = this.items.filter(
      (item) => item.packageId?.toString() === packageId,
    )

    if (!customsDeclarationItems.length) {
      return null
    }

    return customsDeclarationItems
  }

  async deleteManyByPackageId(packageId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.packageId?.toString() === packageId,
    )
    this.items.splice(itemIndex, 1)
  }

  async createMany(customsDeclarationItem: CustomsDeclarationItem[]) {
    this.items.push(...customsDeclarationItem)
  }
}
