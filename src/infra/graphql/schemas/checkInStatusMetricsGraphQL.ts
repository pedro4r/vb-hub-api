import { CheckInStatusMetrics } from '@/domain/parcel-forwarding/enterprise/entities/value-objects/check-ins-status-metrics'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'

@ObjectType()
export class CheckInStatusMetricsDTO {
  @Field(() => GraphQLJSON) // Using GraphQL to allow any JSON object
  metrics: Record<string, number>

  @Field(() => Int)
  totalCount: number

  constructor(metrics: Record<string, number>, totalCount: number) {
    this.metrics = metrics
    this.totalCount = totalCount
  }

  static fromDomain(
    checkInStatusMetrics: CheckInStatusMetrics,
  ): CheckInStatusMetricsDTO {
    return new CheckInStatusMetricsDTO(
      checkInStatusMetrics.metrics,
      checkInStatusMetrics.totalCount,
    )
  }
}
