import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ItemInfo {
  description: string
  value: number
  quantity: number
}

export interface CustomsDeclarationProps {
  customerId: UniqueEntityID
  packageId: UniqueEntityID
  itemsList: ItemInfo[]
}

export class CustomsDeclaration extends Entity<CustomsDeclarationProps> {
  get customerId() {
    return this.props.packageId
  }

  get packageId() {
    return this.props.packageId
  }

  get itemList() {
    return this.props.itemsList
  }

  static create(props: CustomsDeclarationProps, id?: UniqueEntityID) {
    const customsDeclaration = new CustomsDeclaration(props, id)
    return customsDeclaration
  }
}
