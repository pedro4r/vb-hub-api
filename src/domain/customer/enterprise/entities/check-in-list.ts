import { WatchedList } from '@/core/entities/watched-list'
import { CheckIn } from '@/domain/parcel-forwarding/enterprise/entities/check-in'

export class CheckInList extends WatchedList<CheckIn> {
  compareItems(a: CheckIn, b: CheckIn): boolean {
    return a.id.equals(b.id)
  }
}
