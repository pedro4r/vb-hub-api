import { Module } from '@nestjs/common'
import { RegisterParcelForwardingController } from './controller/register-parcel-forwarding.controller'
import { AuthenticateController } from './controller/authenticate.controller'
import { CreateCheckInController } from './controller/create-check-in.controller'
import { FetchRecentCheckInsController } from './controller/fetch-recent-check-ins.controller'

import { DatabseModule } from '../database/database.module'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'

@Module({
  imports: [DatabseModule],
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    AuthenticateController,
    CreateCheckInController,
    FetchRecentCheckInsController,
  ],
  providers: [CheckInUseCase],
})
export class HttpModule {}
