import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'
import { CheckIn } from '../../enterprise/entities/check-in'
import { CheckInDetails } from '../../enterprise/entities/value-objects/check-in-details'
import { CheckInPreview } from '../../enterprise/entities/value-objects/check-in-preview'

export abstract class CheckInsRepository {
  abstract create(checkIn: CheckIn): Promise<void>
  abstract findById(id: string): Promise<CheckIn | null>
  abstract findManyRecentByParcelForwardingId(
    parcelForwardingId: string,
    page: number,
  ): Promise<CheckInPreview[]>

  abstract findManyRecentCheckInsDetailsByParcelForwardingId(
    parcelForwardingId: string,
    page: number,
  ): Promise<CheckInDetails[]>

  abstract findDetailsById(checkInId: string): Promise<CheckInDetails | null>

  abstract findManyByPackageId(packadeId: string): Promise<CheckIn[]>

  abstract findManyWithDetailsByPackageId(
    packadeId: string,
    page: number,
  ): Promise<CheckInDetails[]>

  abstract save(checkIn: CheckIn): Promise<void>
  abstract linkManyCheckInToPackage(checkIns: PackageCheckIn[]): Promise<void>
  abstract unlinkManyCheckInToPackage(checkIns: PackageCheckIn[]): Promise<void>
  abstract delete(checkIn: CheckIn): Promise<void>
}
