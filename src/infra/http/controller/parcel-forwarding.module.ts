import { CryptographyModule } from '@/infra/cryptograph/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { RegisterParcelForwardingController } from './parcel-forwarding/register-parcel-forwarding.controller'
import { AuthenticateController } from './parcel-forwarding/authenticate.controller'
import { CreateCheckInController } from './parcel-forwarding/create-check-in.controller'
import { FetchRecentCheckInsController } from './parcel-forwarding/fetch-recent-check-ins.controller'
import { UploadAttachmentController } from './parcel-forwarding/upload-attachment.controller'
import { DeleteCheckInController } from './parcel-forwarding/delete-check-in.controller'
import { GetCheckInController } from './parcel-forwarding/get-check-in.controller'
import { EditCheckInController } from './parcel-forwarding/edit-check-in.controller'
import { FetchRecentCheckInsDetailsController } from './parcel-forwarding/fetch-recent-check-ins-details.controller'
import { FetchRecentPackagesController } from './parcel-forwarding/fetch-recent-packages.controller'
import { GetPackageController } from './parcel-forwarding/get-package.controller'
import { GetPackageCheckInsDetailsController } from './parcel-forwarding/get-package-check-ins-details.controller'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'
import { AuthenticateUseCase } from '@/domain/parcel-forwarding/application/use-cases/authenticate-parcel-forwarding'
import { RegisterParcelForwardingUseCase } from '@/domain/parcel-forwarding/application/use-cases/register-parcel-forwarding'
import { FetchRecentCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins'
import { UploadAndCreateAttachmentUseCase } from '@/domain/parcel-forwarding/application/use-cases/upload-and-create-attachment'
import { DeleteCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/delete-check-in'
import { GetCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-check-in'
import { EditCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/edit-check-in'
import { FetchRecentCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins-details'
import { FetchRecentPackagesUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-packages'
import { GetPackageUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-package'
import { GetPackageCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-package-check-ins-details'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    CreateCheckInController,
    FetchRecentCheckInsController,
    UploadAttachmentController,
    DeleteCheckInController,
    GetCheckInController,
    EditCheckInController,
    FetchRecentCheckInsDetailsController,
    FetchRecentPackagesController,
    GetPackageController,
    GetPackageCheckInsDetailsController,
  ],
  providers: [
    CheckInUseCase,
    AuthenticateUseCase,
    RegisterParcelForwardingUseCase,
    FetchRecentCheckInsUseCase,
    UploadAndCreateAttachmentUseCase,
    DeleteCheckInUseCase,
    GetCheckInUseCase,
    EditCheckInUseCase,
    FetchRecentCheckInsDetailsUseCase,
    FetchRecentPackagesUseCase,
    GetPackageUseCase,
    GetPackageCheckInsDetailsUseCase,
  ],
})
export class ParcelForwardingModule {}
