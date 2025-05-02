import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCheckInsRepository } from './prisma/repositories/prisma-check-ins-repository'
import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { ParcelForwardingsRepository } from '@/domain/parcel-forwarding/application/repositories/parcel-forwardings-repository'
import { PrismaParcelForwardingRepository } from './prisma/repositories/prisma-parcel-forwardings-repository'
import { ShippingAddressRepository } from '@/domain/customer/application/repositories/shipping-address-repository'
import { DeclarationModelRepository } from '@/domain/customer/application/repositories/declaration-model-repository'
import { PrismaShippingAddressesRepository } from './prisma/repositories/prisma-shipping-addresses-repository'
import { PrismaDeclarationModelsRepository } from './prisma/repositories/prisma-declaration-models-repository'
import { DeclarationModelItemsRepository } from '@/domain/customer/application/repositories/declaration-model-item-repository'
import { PrismaDeclarationModelItemsRepository } from './prisma/repositories/prisma-declaration-model-items-repository'
import { PrismaPackageRepository } from './prisma/repositories/prisma-package-repository'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { PackageShippingAddressRepository } from '@/domain/customer/application/repositories/package-shipping-address-repository'
import { PrismaPackageShippingAddressRepository } from './prisma/repositories/prisma-package-shipping-address-repository'
import { AttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { CheckInAttachmentsRepository } from '@/domain/parcel-forwarding/application/repositories/check-in-attachments-repository'
import { PrismaCheckInAttachmentsRepository } from './prisma/repositories/prisma-check-in-attachments-repository'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { PrismaCustomerRepository } from './prisma/repositories/prisma-customers-repository'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    {
      provide: CheckInsRepository,
      useClass: PrismaCheckInsRepository,
    },
    {
      provide: ShippingAddressRepository,
      useClass: PrismaShippingAddressesRepository,
    },
    {
      provide: ParcelForwardingsRepository,
      useClass: PrismaParcelForwardingRepository,
    },
    {
      provide: DeclarationModelRepository,
      useClass: PrismaDeclarationModelsRepository,
    },
    {
      provide: DeclarationModelItemsRepository,
      useClass: PrismaDeclarationModelItemsRepository,
    },

    {
      provide: PackageRepository,
      useClass: PrismaPackageRepository,
    },
    {
      provide: PackageShippingAddressRepository,
      useClass: PrismaPackageShippingAddressRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: CheckInAttachmentsRepository,
      useClass: PrismaCheckInAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    CheckInsRepository,
    ParcelForwardingsRepository,
    ShippingAddressRepository,
    DeclarationModelRepository,
    DeclarationModelItemsRepository,
    PackageRepository,
    PackageShippingAddressRepository,
    AttachmentsRepository,
    CheckInAttachmentsRepository,
    CustomerRepository,
  ],
})
export class DatabaseModule {}
