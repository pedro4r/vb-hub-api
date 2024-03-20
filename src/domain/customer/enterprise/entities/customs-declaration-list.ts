import { WatchedList } from '@/core/entities/watched-list'
import { CustomsDeclarationItem } from './customs-declaration-item'

export class CustomsDeclarationList extends WatchedList<CustomsDeclarationItem> {
  compareItems(a: CustomsDeclarationItem, b: CustomsDeclarationItem): boolean {
    return (
      a.id.equals(b.id) &&
      a.packageId.equals(b.packageId) &&
      a.description === b.description &&
      a.quantity === b.quantity &&
      a.value === b.value
    )
  }
}
