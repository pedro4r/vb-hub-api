import { WatchedList } from '@/core/entities/watched-list'
import { PackageCheckIn } from './package-check-in'

export class PackageCheckInsList extends WatchedList<PackageCheckIn> {
  compareItems(a: PackageCheckIn, b: PackageCheckIn): boolean {
    return a.id.equals(b.id)
  }
}
