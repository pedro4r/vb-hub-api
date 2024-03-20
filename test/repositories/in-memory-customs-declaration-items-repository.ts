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

  async deleteMany(customsDeclarationItems: CustomsDeclarationItem[]) {
    const declarationItems = this.items.filter((declarationItem) => {
      return !customsDeclarationItems.some((item) =>
        item.equals(declarationItem),
      )
    })

    this.items = declarationItems
  }

  async createMany(customsDeclarationItems: CustomsDeclarationItem[]) {
    this.items.push(...customsDeclarationItems)
  }
}
