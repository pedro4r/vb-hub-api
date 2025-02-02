import { FilteredPackagesData } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/filtered-packages'

export class PackagePresenter {
  static toHTTP(packagesData: FilteredPackagesData) {
    const packages = packagesData.packages.map((packagePreview) => {
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
    })

    const packagesPreview = {
      packages,
      meta: {
        pageIndex: packagesData.meta.pageIndex,
        perPage: packagesData.meta.perPage,
        totalCount: packagesData.meta.totalCount,
      },
    }

    return packagesPreview
  }
}
