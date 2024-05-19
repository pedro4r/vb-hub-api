import { ValueObject } from '@/core/entities/value-object'
import { CheckInPreview } from './check-in-preview'

export interface FetchRecentCheckInsDataProps {
  checkIns: CheckInPreview[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export class FetchRecentCheckInsData extends ValueObject<FetchRecentCheckInsDataProps> {
  get checkIns() {
    return this.props.checkIns
  }

  get meta() {
    return this.props.meta
  }

  static create(props: FetchRecentCheckInsDataProps) {
    return new FetchRecentCheckInsData(props)
  }
}
