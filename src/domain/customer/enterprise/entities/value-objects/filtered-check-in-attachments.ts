import { ValueObject } from '@/core/entities/value-object'
import { CheckInAttachmentDetails } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-attachment-details'

export interface FilteredCheckInsDataProps {
  checkInsAttachments: CheckInAttachmentDetails[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export class FilteredCheckInAttachmentsData extends ValueObject<FilteredCheckInsDataProps> {
  get checkInsAttachments() {
    return this.props.checkInsAttachments
  }

  get meta() {
    return this.props.meta
  }

  static create(props: FilteredCheckInsDataProps) {
    return new FilteredCheckInAttachmentsData(props)
  }
}
