import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CustomsDeclarationItemProps {
  customsDeclarationId?: UniqueEntityID
  description: string
  value: number
  quantity: number
}

export class CustomsDeclarationItem extends Entity<CustomsDeclarationItemProps> {
  get customsDeclarationId() {
    return this.props.customsDeclarationId
  }

  set customsDeclarationId(id: UniqueEntityID | undefined) {
    this.props.customsDeclarationId = id
  }

  get description() {
    return this.props.description
  }

  get value() {
    return this.props.value
  }

  get quantity() {
    return this.props.quantity
  }

  static create(props: CustomsDeclarationItemProps, id?: UniqueEntityID) {
    const customsDeclarationItem = new CustomsDeclarationItem(props, id)
    return customsDeclarationItem
  }
}
