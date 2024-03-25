import { Module } from '@nestjs/common'
import { RegisterParcelForwardingController } from './controller/register-parcel-forwarding.controller'
import { AuthenticateController } from './controller/authenticate.controller'
import { CreateCheckInController } from './controller/create-check-in.controller'
import { FetchRecentCheckInsController } from './controller/fetch-recent-check-ins.controller'
import { DatabaseModule } from '../database/database.module'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'
import { AuthenticateUseCase } from '@/domain/parcel-forwarding/application/use-cases/authenticate-parcel-forwarding'
import { RegisterParcelForwardingUseCase } from '@/domain/parcel-forwarding/application/use-cases/register-parcel-forwarding'
import { CryptographyModule } from '../cryptograph/cryptograph.module'
import { FetchRecentCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins'
import { CreateShippingAddressUseCase } from '@/domain/customer/application/use-cases/create-shipping-address'
import { CreateShippingAddressController } from './controller/create-shipping-address.controller'
import { CreateDeclarationModelController } from './controller/create-declaration-model.controller'
import { CreateDeclarationModelUseCase } from '@/domain/customer/application/use-cases/create-declaration-model'
import { CreatePackageUseCase } from '@/domain/customer/application/use-cases/create-package'
import { CreatePackageController } from './controller/create-package.controller'
import { EditShippingAddressController } from './controller/edit-shipping-address.controller'
import { EditShippingAddressUseCase } from '@/domain/customer/application/use-cases/edit-shipping-address'
import { DeleteShippingAddressController } from './controller/delete-shipping-address.controller'
import { DeleteShippingAddressUseCase } from '@/domain/customer/application/use-cases/delete-shipping-address'
import { FetchShippingAddressUseCase } from '@/domain/customer/application/use-cases/fetch-shipping-address'
import { FetchShippingAddressController } from './controller/fetch-shipping-address.controller'
import { GetShippingAddressController } from './controller/get-shipping-address.controller'
import { GetShippingAddressUseCase } from '@/domain/customer/application/use-cases/get-shipping-address'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    AuthenticateController,
    CreateCheckInController,
    CreateShippingAddressController,
    FetchRecentCheckInsController,
    CreateDeclarationModelController,
    CreatePackageController,
    EditShippingAddressController,
    DeleteShippingAddressController,
    FetchShippingAddressController,
    GetShippingAddressController,
  ],
  providers: [
    CheckInUseCase,
    CreateShippingAddressUseCase,
    AuthenticateUseCase,
    RegisterParcelForwardingUseCase,
    FetchRecentCheckInsUseCase,
    CreateDeclarationModelUseCase,
    CreatePackageUseCase,
    EditShippingAddressUseCase,
    DeleteShippingAddressUseCase,
    FetchShippingAddressUseCase,
    GetShippingAddressUseCase,
  ],
})
export class HttpModule {}
