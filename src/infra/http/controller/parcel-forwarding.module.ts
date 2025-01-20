import { CryptographyModule } from '@/infra/cryptograph/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { RegisterParcelForwardingController } from './parcel-forwarding/register-parcel-forwarding.controller'
import { AuthenticateController } from './parcel-forwarding/authenticate.controller'
import { CreateCheckInController } from './parcel-forwarding/create-check-in.controller'
import { UploadAttachmentController } from './parcel-forwarding/upload-attachment.controller'
import { DeleteCheckInController } from './parcel-forwarding/delete-check-in.controller'
import { GetCheckInController } from './parcel-forwarding/get-check-in.controller'
import { EditCheckInController } from './parcel-forwarding/edit-check-in.controller'
import { FilterCheckInsDetailsController } from './parcel-forwarding/filter-check-ins-details.controller'
import { FetchRecentPackagesController } from './parcel-forwarding/fetch-recent-packages.controller'
import { GetPackageController } from './parcel-forwarding/get-package.controller'
import { GetPackageCheckInsDetailsController } from './parcel-forwarding/get-package-check-ins-details.controller'
import { CheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-in'
import { AuthenticateUseCase } from '@/domain/parcel-forwarding/application/use-cases/authenticate-parcel-forwarding'
import { RegisterParcelForwardingUseCase } from '@/domain/parcel-forwarding/application/use-cases/register-parcel-forwarding'
import { UploadAndCreateAttachmentUseCase } from '@/domain/parcel-forwarding/application/use-cases/upload-and-create-attachment'
import { DeleteCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/delete-check-in'
import { GetCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-check-in'
import { EditCheckInUseCase } from '@/domain/parcel-forwarding/application/use-cases/edit-check-in'
import { FilterCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins-details'
import { FetchRecentPackagesUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-packages'
import { GetPackageUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-package'
import { GetPackageCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-package-check-ins-details'
import { TestController } from './parcel-forwarding/test-route.controller'
import { GetCustomerByHubIdController } from './parcel-forwarding/get-customer-by-hub-id.controller'
import { GetCustomerByHubIdUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-customer-by-hub-id'
import { FetchCustomersByNameController } from './parcel-forwarding/fetch-customers-by-name.controller'
import { FetchCustomersByNameUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-customers-by-name'
import { CheckInDetailsPresenter } from '../presenters/check-in-details-presenter'
import { EnvModule } from '@/infra/env/env.module'
import { AuthModule } from '@/infra/auth/auth.module'
import { CreatePasswordResetUrlUseCase } from '@/domain/parcel-forwarding/application/use-cases/create-password-reset-url'
import { SendResetPasswordEmailUseCase } from '@/domain/parcel-forwarding/application/use-cases/send-reset-password-email'
import { MailModule } from '@/infra/mail/mail.module'
import { SendResetPasswordEmailController } from './parcel-forwarding/send-reset-password-email.controller'
import { VerifyUserAuthController } from './parcel-forwarding/verify-user-auth.controller'
import { VerifyResetPasswordTokenUseCase } from '@/domain/parcel-forwarding/application/use-cases/verify-reset-password-token'
import { VerifyResetPasswordTokenController } from './parcel-forwarding/verify-reset-password-token.controller'
import { ResetParcelForwardingPasswordController } from './parcel-forwarding/reset-password.controller'
import { ResetParcelForwardingPasswordUseCase } from '@/domain/parcel-forwarding/application/use-cases/reset-password'
import { SendNewCheckInEmailUseCase } from '@/domain/parcel-forwarding/application/use-cases/send-new-check-in-email'
import { CheckInEmailBodyTemplates } from '@/core/email/templates/check-in'
import { FilterCheckInsController } from './parcel-forwarding/filter-check-ins.controller'
import { FilterCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins'
import { CheckInAttachmentDetailsPresenter } from '../presenters/check-in-attachment-presenter'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    StorageModule,
    EnvModule,
    AuthModule,
    MailModule,
  ],
  controllers: [
    RegisterParcelForwardingController,
    AuthenticateController,
    CreateCheckInController,
    UploadAttachmentController,
    DeleteCheckInController,
    GetCheckInController,
    EditCheckInController,
    FilterCheckInsDetailsController,
    FetchRecentPackagesController,
    GetPackageController,
    GetPackageCheckInsDetailsController,
    TestController,
    GetCustomerByHubIdController,
    FetchCustomersByNameController,
    VerifyUserAuthController,
    SendResetPasswordEmailController,
    VerifyResetPasswordTokenController,
    ResetParcelForwardingPasswordController,
    FilterCheckInsController,
  ],
  providers: [
    CheckInUseCase,
    AuthenticateUseCase,
    RegisterParcelForwardingUseCase,
    UploadAndCreateAttachmentUseCase,
    DeleteCheckInUseCase,
    GetCheckInUseCase,
    EditCheckInUseCase,
    FilterCheckInsDetailsUseCase,
    FetchRecentPackagesUseCase,
    GetPackageUseCase,
    GetPackageCheckInsDetailsUseCase,
    GetCustomerByHubIdUseCase,
    FetchCustomersByNameUseCase,
    CheckInDetailsPresenter,
    CheckInAttachmentDetailsPresenter,
    CreatePasswordResetUrlUseCase,
    SendResetPasswordEmailUseCase,
    VerifyResetPasswordTokenUseCase,
    ResetParcelForwardingPasswordUseCase,
    SendNewCheckInEmailUseCase,
    CheckInEmailBodyTemplates,
    FilterCheckInsUseCase,
  ],
})
export class ParcelForwardingModule {}
