import { CustomsDeclarationRepository } from '@/domain/customer/application/repositories/customs-declaration-repository'
import { CustomsDeclaration } from '@/domain/customer/enterprise/entities/customs-declaration'

export class InMemoryCustomsDeclarationRepository
  implements CustomsDeclarationRepository
{
  public items: CustomsDeclaration[] = []

  async save(customsDeclaration: CustomsDeclaration) {
    const itemIndex = this.items.findIndex((item) =>
      item.packageId.equals(customsDeclaration.packageId),
    )
    this.items[itemIndex] = customsDeclaration
  }

  async findById(packageId: string) {
    const customsDeclaration = this.items.find(
      (item) => item.packageId.toString() === packageId,
    )
    if (!customsDeclaration) {
      return null
    }

    return customsDeclaration
  }

  async delete(packageId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.packageId.toString() === packageId,
    )
    this.items.splice(itemIndex, 1)
  }

  async create(customsDeclaration: CustomsDeclaration) {
    this.items.push(customsDeclaration)
  }
}
