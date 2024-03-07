import { Module } from '@nestjs/common'
import { RegisterParcelForwardingController } from './controller/register-parcel-forwarding.controller'
import { AuthenticateController } from './controller/authenticate.controller'
import { CreateCheckInController } from './controller/create-check-in.controller'
import { FetchRecentCheckInsController } from './controller/fetch-recent-check-ins.controller'

import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    AuthenticateController,
    CreateCheckInController,
    FetchRecentCheckInsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
