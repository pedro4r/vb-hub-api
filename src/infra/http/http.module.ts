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
import { EditDeclarationModelController } from './controller/edit-declaration-model.controller'
import { EditDeclarationModelUseCase } from '@/domain/customer/application/use-cases/edit-declaration-model'
import { DeleteDeclarationModelController } from './controller/delete-declaration-model.controller'
import { DeleteDeclarationModelUseCase } from '@/domain/customer/application/use-cases/delete-declaration-model'
import { FetchDeclarationModelsController } from './controller/fetch-declaration-models.controller'
import { FetchDeclarationModelsUseCase } from '@/domain/customer/application/use-cases/fetch-declaration-model'
import { GetDeclarationModelController } from './controller/get-declaration-model.controller'
import { GetDeclarationModelUseCase } from '@/domain/customer/application/use-cases/get-declaration-model'
import { UploadAttachmentController } from './controller/upload-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/parcel-forwarding/application/use-cases/upload-and-create-attachment'
import { StorageModule } from '../storage/storage.module'
import { DeleteCheckInController } from './controller/delete-check-in.controller'
import { DeleteCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/delete-check-in'
import { GetCheckInController } from './controller/get-check-in.controller'
import { GetCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-check-in'
import { EditCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/edit-check-in'
import { EditCheckInController } from './controller/edit-check-in.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
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
    EditDeclarationModelController,
    DeleteDeclarationModelController,
    FetchDeclarationModelsController,
    GetDeclarationModelController,
    UploadAttachmentController,
    DeleteCheckInController,
    GetCheckInController,
    EditCheckInController,
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
    EditDeclarationModelUseCase,
    DeleteDeclarationModelUseCase,
    FetchDeclarationModelsUseCase,
    GetDeclarationModelUseCase,
    UploadAndCreateAttachmentUseCase,
    DeleteCheckInUseCase,
    GetCheckInUseCase,
    EditCheckInUseCase,
  ],
})
export class HttpModule {}
