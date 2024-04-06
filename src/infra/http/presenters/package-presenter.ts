import { PackagePreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/package-preview'

export class PackagePresenter {
  static toHTTP(packagePreview: PackagePreview) {
    return {
      packageId: packagePreview.packageId.toString(),
      parcelForwardingId: packagePreview.parcelForwardingId.toString(),
      customerId: packagePreview.customerId.toString(),
      hubId: packagePreview.hubId,
      customerFirstName: packagePreview.customerFirstName,
      customerLastName: packagePreview.customerLastName,
      weight: packagePreview.weight || null,
      trackingNumber: packagePreview.trackingNumber || null,
      hasBattery: packagePreview.hasBattery,
      createdAt: packagePreview.createdAt,
      updatedAt: packagePreview.updatedAt || null,
    }
  }
}
