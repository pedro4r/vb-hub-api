import { CustomsDeclarationItemsRepository } from '@/domain/customer/application/repositories/customs-declaration-item-repository'
import { CustomsDeclarationRepository } from '@/domain/customer/application/repositories/customs-declaration-repository'
import { CustomsDeclaration } from '@/domain/customer/enterprise/entities/customs-declaration'

export class InMemoryCustomsDeclarationRepository
  implements CustomsDeclarationRepository
{
  public items: CustomsDeclaration[] = []

  constructor(
    private customsDeclarationItemsRepository: CustomsDeclarationItemsRepository,
  ) {}

  async findManyByCustomerId(customerId: string) {
    const customsDeclarations = this.items.filter(
      (item) => item.customerId.toString() === customerId,
    )

    if (!customsDeclarations) {
      return null
    }

    return customsDeclarations
  }

  async delete(customsDeclaration: CustomsDeclaration) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(customsDeclaration.id),
    )

    this.items.splice(itemIndex, 1)

    await this.customsDeclarationItemsRepository.deleteMany(
      customsDeclaration.items.getItems(),
    )
  }

  async findById(customsDeclarationId: string) {
    const customsDeclaration = this.items.find(
      (item) => item.id.toString() === customsDeclarationId,
    )
    if (!customsDeclaration) {
      return null
    }

    return customsDeclaration
  }

  async save(customsDeclaration: CustomsDeclaration): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(customsDeclaration.id),
    )

    this.items[itemIndex] = customsDeclaration

    await this.customsDeclarationItemsRepository.createMany(
      customsDeclaration.items.getNewItems(),
    )

    await this.customsDeclarationItemsRepository.deleteMany(
      customsDeclaration.items.getRemovedItems(),
    )
  }

  async create(customsDeclaration: CustomsDeclaration) {
    this.items.push(customsDeclaration)

    await this.customsDeclarationItemsRepository.createMany(
      customsDeclaration.items.getItems(),
    )
  }
}
