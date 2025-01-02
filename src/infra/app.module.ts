import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { ResolverModule } from './graphql/graphql.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    ResolverModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*')
  }
}
