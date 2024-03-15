import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomsDeclarationList } from './customs-declaration-list'
import { Optional } from '@/core/types/opitional'

export interface CustomsDeclarationProps {
  title: string
  customerId: UniqueEntityID
  items: CustomsDeclarationList
}

export class CustomsDeclaration extends Entity<CustomsDeclarationProps> {
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

  set items(items: CustomsDeclarationList) {
    this.props.items = items
  }

  static create(
    props: Optional<CustomsDeclarationProps, 'items'>,
    id?: UniqueEntityID,
  ) {
    const customsDeclaration = new CustomsDeclaration(
      {
        ...props,
        items: new CustomsDeclarationList(),
      },
      id,
    )

    return customsDeclaration
  }
}
