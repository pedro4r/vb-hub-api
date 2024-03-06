import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RegisterParcelForwardingController } from './controller/register-parcel-forwarding.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controller/authenticate.controller'
import { CreateCheckInController } from './controller/create-check-in.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    AuthenticateController,
    CreateCheckInController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
