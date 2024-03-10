import { Module } from '@nestjs/common'
import { RegisterParcelForwardingController } from './controller/register-parcel-forwarding.controller'
import { AuthenticateController } from './controller/authenticate.controller'
import { CreateCheckInController } from './controller/create-check-in.controller'
import { FetchRecentCheckInsController } from './controller/fetch-recent-check-ins.controller'

import { DatabseModule } from '../database/database.module'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'
import { AuthenticateUseCase } from '@/domain/parcel-forwarding/application/use-cases/authenticate-parcel-forwarding'
import { RegisterParcelForwardingUseCase } from '@/domain/parcel-forwarding/application/use-cases/register-parcel-forwarding'
import { CryptographyModule } from '../cryptograph/cryptograph.module'
import { FetchRecentCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins'

@Module({
  imports: [DatabseModule, CryptographyModule],
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    AuthenticateController,
    CreateCheckInController,
    FetchRecentCheckInsController,
  ],
  providers: [
    CheckInUseCase,
    AuthenticateUseCase,
    RegisterParcelForwardingUseCase,
    FetchRecentCheckInsUseCase,
  ],
})
export class HttpModule {}
