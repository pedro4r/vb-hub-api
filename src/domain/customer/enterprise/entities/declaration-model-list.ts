import { WatchedList } from '@/core/entities/watched-list'
import { DeclarationModelItem } from './declaration-model-item'

export class DeclarationModelList extends WatchedList<DeclarationModelItem> {
  compareItems(a: DeclarationModelItem, b: DeclarationModelItem): boolean {
    return (
      a.id.equals(b.id) &&
      a.description === b.description &&
      a.quantity === b.quantity &&
      a.value === b.value
    )
  }
}
