import { FilteredCheckInsData } from '@/domain/customer/enterprise/entities/value-objects/filtered-check-ins'

export class CheckInPresenter {
  static toHTTP(checkInsData: FilteredCheckInsData) {
    const checkIns = checkInsData.checkIns.map((checkIns) => {
      return {
        checkInId: checkIns.checkInId.toString(),
        parcelForwardingId: checkIns.parcelForwardingId.toString(),
        customerId: checkIns.customerId.toString(),
        hubId: checkIns.hubId,
        customerFirstName: checkIns.customerFirstName,
        customerLastName: checkIns.customerLastName,
        packageId: checkIns.packageId?.toString() || null,
        status: checkIns.status,
        weight: checkIns.weight || null,
        createdAt: checkIns.createdAt,
        updatedAt: checkIns.updatedAt || null,
      }
    })

    const checkInsPreview = {
      checkIns,
      meta: {
        pageIndex: checkInsData.meta.pageIndex,
        perPage: checkInsData.meta.perPage,
        totalCount: checkInsData.meta.totalCount,
      },
    }

    return checkInsPreview
  }
}
