// import { Resolver, Query, Context, Args } from '@nestjs/graphql'
// import { UseGuards } from '@nestjs/common'
// import { CheckInStatusMetricsDTO } from '../schemas/checkInStatusMetricsGraphQL'
// import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
// import { FilterCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins'
// import { GetCustomerByHubIdUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-customer-by-hub-id'

// @Resolver()
// export class CustomerDetailsResolver {
//   constructor(
//     private filterCheckInsUseCase: FilterCheckInsUseCase,
//     private getCustomerByHubIdUseCase: GetCustomerByHubIdUseCase,
//   ) {}

//   @Query(() => CheckInStatusMetricsDTO)
//   @UseGuards(JwtAuthGuard)
//   async getCheckInsStatusMetrics(
//     @Context() context,
//     @Args('metrics', { type: () => [String], nullable: true })
//     metrics?: string[],
//   ) {
//     const user = context.req.user
//     if (!user) {
//       throw new Error('Unauthorized')
//     }

//     const parcelForwardingId = user.sub
//     const result = await this.checkInsStatusMetricsUseCase.execute({
//       parcelForwardingId,
//       metrics,
//     })

//     if (result.isRight()) {
//       const checkInStatusMetrics = result.value?.checkInStatusMetrics
//       return CheckInStatusMetricsDTO.fromDomain(checkInStatusMetrics)
//     }
//     throw new Error('Failed to get check-in status metrics')
//   }
// }
