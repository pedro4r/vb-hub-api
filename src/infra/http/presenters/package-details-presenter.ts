import { PackageDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-details'

export class PackageDetailsPresenter {
  static toHTTP(packageDetails: PackageDetails) {
    return {
      packageId: packageDetails.packageId.toString(),
      parcelForwardingId: packageDetails.parcelForwardingId.toString(),
      customerId: packageDetails.customerId.toString(),
      hubId: packageDetails.hubId,
      customerFirstName: packageDetails.customerFirstName,
      customerLastName: packageDetails.customerLastName,
      weight: packageDetails.weight || null,
      trackingNumber: packageDetails.trackingNumber || null,
      hasBattery: packageDetails.hasBattery,
      createdAt: packageDetails.createdAt,
      updatedAt: packageDetails.updatedAt || null,
    }
  }
}
