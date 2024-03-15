import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomsDeclarationItem } from './customs-declaration-item'

export interface PackageCustomsDeclarationProps {
  packageId: UniqueEntityID
  itemsLists: CustomsDeclarationItem[]
}

export class PackageCustomsDeclaration extends Entity<PackageCustomsDeclarationProps> {
  get packageId() {
    return this.props.packageId
  }

  get itemsLists() {
    return this.props.itemsLists
  }

  static create(props: PackageCustomsDeclarationProps, id?: UniqueEntityID) {
    const packageCustomsDeclaration = new PackageCustomsDeclaration(props, id)
    return packageCustomsDeclaration
  }
}
