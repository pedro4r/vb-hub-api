import { Module } from '@nestjs/common'
import { HelloResolver } from './hello.resolver'
import { GoodbyeResolver } from './goodbye.resolver'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }), // Inclua req e res no contexto
    }),
  ],
  providers: [HelloResolver, GoodbyeResolver],
})
export class ResolverModule {}
