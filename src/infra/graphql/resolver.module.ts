import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { UseCasesModule } from './use-case.module'
import { CheckInsStatusMetricsResolver } from './resolvers/check-in-status-metrics.resolver'
import { HelloResolver } from './resolvers/hello.resolver'
import { GoodbyeResolver } from './resolvers/goodbye.resolver'
import { CustomerProfileResolver } from './resolvers/customer-profile.resolver'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/graphql',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    UseCasesModule,
  ],
  providers: [
    HelloResolver,
    GoodbyeResolver,
    CheckInsStatusMetricsResolver,
    CustomerProfileResolver,
  ],
})
export class ResolverModule {}
