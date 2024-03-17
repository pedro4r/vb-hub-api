import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeclarationModelItemProps {
  declarationModelId?: UniqueEntityID
  description: string
  value: number
  quantity: number
}

export class DeclarationModelItem extends Entity<DeclarationModelItemProps> {
  get declarationModelId() {
    return this.props.declarationModelId
  }

  set declarationModelId(id: UniqueEntityID | undefined) {
    this.props.declarationModelId = id
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

  static create(props: DeclarationModelItemProps, id?: UniqueEntityID) {
    const declarationModelItem = new DeclarationModelItem(props, id)
    return declarationModelItem
  }
}
