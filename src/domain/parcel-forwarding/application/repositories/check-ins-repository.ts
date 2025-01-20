import { PackageCheckIn } from '@/domain/customer/enterprise/entities/package-check-in'
import { CheckIn, CheckInStatus } from '../../enterprise/entities/check-in'
import { CheckInDetails } from '../../enterprise/entities/value-objects/check-in-details'
import { CheckInPreview } from '../../enterprise/entities/value-objects/check-in-preview'
import { FilteredCheckInsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-ins'
import { CheckInStatusMetrics } from '../../enterprise/entities/value-objects/check-ins-status-metrics'
import { FilteredCheckInAttachmentsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-in-attachments'

export abstract class CheckInsRepository {
  abstract getMetricStatus(
    parcelForwardingId: string,
    metrics?: string[],
  ): Promise<CheckInStatusMetrics>

  abstract create(checkIn: CheckIn): Promise<void>
  abstract findById(id: string): Promise<CheckIn | null>
  abstract findManyRecentByParcelForwardingId(
    parcelForwardingId: string,
    page: number,
  ): Promise<CheckInPreview[]>

  abstract findManyCheckInsAttachmentDetailsByFilter(
    parcelForwardingId: string,
    page: number,
    customersId?: string[],
    checkInStatus?: CheckInStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<FilteredCheckInAttachmentsData>

  abstract findManyCheckInsByFilter(
    parcelForwardingId: string,
    page: number,
    customersId?: string[],
    checkInStatus?: CheckInStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<FilteredCheckInsData>

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
