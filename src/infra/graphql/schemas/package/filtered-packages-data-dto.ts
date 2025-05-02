import { PackageStatus } from '@/domain/customer/enterprise/entities/package'
import { FilteredPackagesData } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/filtered-packages'
import { PackagePreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-preview'
import { Field, ObjectType, Int } from '@nestjs/graphql'
import { Meta } from '../meta/meta-data-dto'

@ObjectType()
export class PackagePreviewDTO {
  @Field(() => String)
  packageId: string

  @Field(() => String)
  parcelForwardingId: string

  @Field(() => String)
  customerId: string

  @Field(() => Int)
  hubId: number

  @Field(() => String)
  customerFirstName: string

  @Field(() => String)
  customerLastName: string

  @Field(() => Int, { nullable: true })
  weight?: number

  @Field(() => String)
  packageStatus: string

  @Field(() => Boolean)
  hasBattery: boolean

  @Field(() => String, { nullable: true })
  trackingNumber?: string

  @Field(() => String)
  createdAt: string

  @Field(() => String, { nullable: true })
  updatedAt?: string

  static fromDomain(packagePreview: PackagePreview): PackagePreviewDTO {
    return {
      packageId: packagePreview.packageId.toString(),
      parcelForwardingId: packagePreview.parcelForwardingId.toString(),
      customerId: packagePreview.customerId.toString(),
      hubId: packagePreview.hubId,
      customerFirstName: packagePreview.customerFirstName,
      customerLastName: packagePreview.customerLastName,
      weight: packagePreview.weight,
      packageStatus: PackageStatus[packagePreview.packageStatus],
      hasBattery: packagePreview.hasBattery,
      trackingNumber: packagePreview.trackingNumber ?? '',
      createdAt: packagePreview.createdAt.toISOString(),
      updatedAt: packagePreview.updatedAt?.toISOString(),
    }
  }
}

@ObjectType()
export class FilteredPackagesDataDTO {
  @Field(() => [PackagePreviewDTO])
  packages: PackagePreviewDTO[]

  @Field(() => Meta)
  meta: Meta

  static fromDomain(
    filteredPackagesData: FilteredPackagesData,
  ): FilteredPackagesDataDTO {
    return {
      packages: filteredPackagesData.packages.map(PackagePreviewDTO.fromDomain),
      meta: filteredPackagesData.meta,
    }
  }
}
