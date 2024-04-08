import { CryptographyModule } from '@/infra/cryptograph/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { CreateShippingAddressController } from './customer/create-shipping-address.controller'
import { CreateDeclarationModelController } from './customer/create-declaration-model.controller'
import { CreatePackageController } from './customer/create-package.controller'
import { EditShippingAddressController } from './customer/edit-shipping-address.controller'
import { DeleteShippingAddressController } from './customer/delete-shipping-address.controller'
import { FetchShippingAddressController } from './customer/fetch-shipping-address.controller'
import { GetShippingAddressController } from './customer/get-shipping-address.controller'
import { EditDeclarationModelController } from './customer/edit-declaration-model.controller'
import { DeleteDeclarationModelController } from './customer/delete-declaration-model.controller'
import { FetchDeclarationModelsController } from './customer/fetch-declaration-models.controller'
import { GetDeclarationModelController } from './customer/get-declaration-model.controller'
import { CreateShippingAddressUseCase } from '@/domain/customer/application/use-cases/create-shipping-address'
import { CreateDeclarationModelUseCase } from '@/domain/customer/application/use-cases/create-declaration-model'
import { CreatePackageUseCase } from '@/domain/customer/application/use-cases/create-package'
import { EditShippingAddressUseCase } from '@/domain/customer/application/use-cases/edit-shipping-address'
import { DeleteShippingAddressUseCase } from '@/domain/customer/application/use-cases/delete-shipping-address'
import { FetchShippingAddressUseCase } from '@/domain/customer/application/use-cases/fetch-shipping-address'
import { GetShippingAddressUseCase } from '@/domain/customer/application/use-cases/get-shipping-address'
import { EditDeclarationModelUseCase } from '@/domain/customer/application/use-cases/edit-declaration-model'
import { DeleteDeclarationModelUseCase } from '@/domain/customer/application/use-cases/delete-declaration-model'
import { FetchDeclarationModelsUseCase } from '@/domain/customer/application/use-cases/fetch-declaration-model'
import { GetDeclarationModelUseCase } from '@/domain/customer/application/use-cases/get-declaration-model'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateShippingAddressController,
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
  ],
  providers: [
    CreateShippingAddressUseCase,
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
  ],
})
export class CustomerModule {}
