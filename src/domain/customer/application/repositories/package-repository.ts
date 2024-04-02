import { PackagePreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-preview'
import { Package } from '../../enterprise/entities/package'

export abstract class PackageRepository {
  abstract create(pkg: Package): Promise<void>
  abstract findById(id: string): Promise<Package | null>
  abstract save(pkg: Package): Promise<void>
  abstract delete(pkg: Package): Promise<void>
  abstract findManyByCustomerId(id: string): Promise<Package[]>
  abstract findManyRecentByParcelForwardingId(
    id: string,
    page: number,
  ): Promise<PackagePreview[]>
}
