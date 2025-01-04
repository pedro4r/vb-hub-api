import { ObjectType, Field, Int } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json' // Importando GraphQLJSON

@ObjectType()
export class CheckInStatusMetricsDTO {
  @Field(() => GraphQLJSON) // Usando GraphQLJSON para permitir objetos
  metrics: Record<string, number>

  @Field(() => Int)
  totalCount: number

  constructor(metrics: Record<string, number>, totalCount: number) {
    this.metrics = metrics
    this.totalCount = totalCount
  }

  static fromDomain(checkInStatusMetrics: any): CheckInStatusMetricsDTO {
    return new CheckInStatusMetricsDTO(
      checkInStatusMetrics.metrics,
      checkInStatusMetrics.totalCount,
    )
  }
}
