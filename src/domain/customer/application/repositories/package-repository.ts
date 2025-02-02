import { Package, PackageStatus } from '../../enterprise/entities/package'
import { PackageDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-details'
import { FilteredPackagesData } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/filtered-packages'

export abstract class PackageRepository {
  abstract create(pkg: Package): Promise<void>
  abstract findById(id: string): Promise<Package | null>
  abstract save(pkg: Package): Promise<void>
  abstract delete(pkg: Package): Promise<void>
  abstract findManyByCustomerId(id: string): Promise<Package[]>
  abstract findManyByFilter(
    parcelForwardingId: string,
    page: number,
    customersId?: string[],
    packageStatus?: PackageStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<FilteredPackagesData>

  abstract findDetailsById(id: string): Promise<PackageDetails | null>
}
