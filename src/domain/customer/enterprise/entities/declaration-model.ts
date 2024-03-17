import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opitional'
import { DeclarationModelList } from './declaration-model-list'

export interface DeclarationModelProps {
  title: string
  customerId: UniqueEntityID
  items: DeclarationModelList
}

export class DeclarationModel extends Entity<DeclarationModelProps> {
  get customerId() {
    return this.props.customerId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get items() {
    return this.props.items
  }

  set items(items: DeclarationModelList) {
    this.props.items = items
  }

  static create(
    props: Optional<DeclarationModelProps, 'items'>,
    id?: UniqueEntityID,
  ) {
    const declarationModel = new DeclarationModel(
      {
        ...props,
        items: new DeclarationModelList(),
      },
      id,
    )

    return declarationModel
  }
}
