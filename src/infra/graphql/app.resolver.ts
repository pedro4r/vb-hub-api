// import { Resolver, Query, Args } from '@nestjs/graphql'
// import { GetClientCountUseCase } from '../domain/use-cases/get-client-count.use-case'
// import { GetShippedBoxesCountUseCase } from '../domain/use-cases/get-shipped-boxes-count.use-case'
// import { GetReceivedPackagesCountUseCase } from '../domain/use-cases/get-received-packages-count.use-case'

// @Resolver()
// export class CompanyStatsResolver {
//   constructor(
//     private readonly getClientCountUseCase: GetClientCountUseCase,
//     private readonly getShippedBoxesCountUseCase: GetShippedBoxesCountUseCase,
//     private readonly getReceivedPackagesCountUseCase: GetReceivedPackagesCountUseCase,
//   ) {}

//   @Query(() => Number)
//   async getClientCount(@Args('companyId') companyId: string): Promise<number> {
//     return this.getClientCountUseCase.execute({ companyId })
//   }

//   @Query(() => Number)
//   async getShippedBoxesCount(
//     @Args('companyId') companyId: string,
//   ): Promise<number> {
//     return this.getShippedBoxesCountUseCase.execute({ companyId })
//   }

//   @Query(() => Number)
//   async getReceivedPackagesCount(
//     @Args('companyId') companyId: string,
//   ): Promise<number> {
//     return this.getReceivedPackagesCountUseCase.execute({ companyId })
//   }
// }

import { Resolver, Query } from '@nestjs/graphql'

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello() {
    return 'Hello World!'
  }
}
