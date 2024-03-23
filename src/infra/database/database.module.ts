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

@Module({
  providers: [
    PrismaService,
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
  ],
  exports: [
    PrismaService,
    CheckInsRepository,
    ParcelForwardingsRepository,
    ShippingAddressRepository,
    DeclarationModelRepository,
    DeclarationModelItemsRepository,
  ],
})
export class DatabseModule {}
