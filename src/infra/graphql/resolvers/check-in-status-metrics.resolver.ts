import { Resolver, Query, Context, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CheckInsStatusMetricsUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-ins-status-metrics'
import { CheckInStatusMetricsDTO } from '../schemas/checkInStatusMetricsGraphQL'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Resolver()
export class CheckInsStatusMetricsResolver {
  constructor(
    private checkInsStatusMetricsUseCase: CheckInsStatusMetricsUseCase,
  ) {}

  @Query(() => CheckInStatusMetricsDTO)
  @UseGuards(JwtAuthGuard)
  async getCheckInsStatusMetrics(
    @Context() context,
    @Args('metrics', { type: () => [String], nullable: true })
    metrics?: string[],
  ) {
    const user = context.req.user
    if (!user) {
      throw new Error('Unauthorized')
    }

    const parcelForwardingId = user.sub
    const result = await this.checkInsStatusMetricsUseCase.execute({
      parcelForwardingId,
      metrics,
    })

    if (result.isRight()) {
      const checkInStatusMetrics = result.value?.checkInStatusMetrics
      return CheckInStatusMetricsDTO.fromDomain(checkInStatusMetrics)
    }
    throw new Error('Failed to get check-in status metrics')
  }
}
