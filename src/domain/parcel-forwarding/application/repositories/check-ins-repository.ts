import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'
import { CheckIn } from '../../enterprise/entities/check-in'

export abstract class CheckInsRepository {
  abstract create(checkIn: CheckIn): Promise<void>
  abstract findById(id: string): Promise<CheckIn | null>
  abstract findManyRecent(
    parcelForwardingId: string,
    page: number,
  ): Promise<CheckIn[] | null>

  abstract findManyByPackageId(packadeId: string): Promise<CheckIn[] | null>
  abstract save(checkIn: CheckIn): Promise<void>
  abstract linkManyCheckInToPackage(checkIns: PackageCheckIn[]): Promise<void>
  abstract unlinkManyCheckInToPackage(checkIns: PackageCheckIn[]): Promise<void>
  abstract delete(checkIn: CheckIn): Promise<void>
}
