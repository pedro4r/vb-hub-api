import { ValueObject } from '@/core/entities/value-object'
import { CheckInStatus } from '../check-in'

export type StatusMetrics = Partial<Record<CheckInStatus, number>>

export interface CheckInStatusMetricsProps {
  metrics: StatusMetrics
  totalCount: number
}

export class CheckInStatusMetrics extends ValueObject<CheckInStatusMetricsProps> {
  get metrics() {
    return this.props.metrics
  }

  get totalCount() {
    return this.props.totalCount
  }

  static create(props: StatusMetrics) {
    const keyToLowerCase = Object.keys(props).reduce((acc, key) => {
      return {
        ...acc,
        [key.toLocaleLowerCase()]: props[key],
      }
    }, {} as StatusMetrics)

    const totalCount = Object.values(keyToLowerCase).reduce(
      (total, count) => total + count,
      0,
    )

    return new CheckInStatusMetrics({ metrics: keyToLowerCase, totalCount })
  }
}
