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
import { CreateShippingAddressUseCase } from '@/domain/customer/application/use-cases/create-shipping-address'
import { CreateShippingAddressController } from './controller/create-shipping-address.controller'
import { CreateDeclarationModelController } from './controller/create-declaration-model.controller'
import { CreateDeclarationModelUseCase } from '@/domain/customer/application/use-cases/create-declaration-model'

@Module({
  imports: [DatabseModule, CryptographyModule],
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    AuthenticateController,
    CreateCheckInController,
    CreateShippingAddressController,
    FetchRecentCheckInsController,
    CreateDeclarationModelController,
  ],
  providers: [
    CheckInUseCase,
    CreateShippingAddressUseCase,
    AuthenticateUseCase,
    RegisterParcelForwardingUseCase,
    FetchRecentCheckInsUseCase,
    CreateDeclarationModelUseCase,
  ],
})
export class HttpModule {}
