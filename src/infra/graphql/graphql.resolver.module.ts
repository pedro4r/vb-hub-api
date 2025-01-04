import { Module } from '@nestjs/common'
import { HelloResolver } from './hello.resolver'
import { GoodbyeResolver } from './goodbye.resolver'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { CheckInsStatusMetricsResolver } from './check-in-status-metrics.resolver'
import { DatabaseModule } from '../database/database.module'
import { CheckInsStatusMetricsUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-ins-status-metrics'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    DatabaseModule,
  ],
  providers: [
    HelloResolver,
    GoodbyeResolver,
    CheckInsStatusMetricsResolver,
    CheckInsStatusMetricsUseCase,
  ],
})
export class GraphQlResolverModule {}
