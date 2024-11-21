import { ValueObject } from '@/core/entities/value-object'
import { CheckInPreview } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-in-preview'

export interface FilteredCheckInsDataProps {
  checkIns: CheckInPreview[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export class FilteredCheckInsData extends ValueObject<FilteredCheckInsDataProps> {
  get checkIns() {
    return this.props.checkIns
  }

  get meta() {
    return this.props.meta
  }

  static create(props: FilteredCheckInsDataProps) {
    return new FilteredCheckInsData(props)
  }
}
