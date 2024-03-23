import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCheckInsRepository } from './prisma/repositories/prisma-check-ins-repository'
import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { ParcelForwardingsRepository } from '@/domain/parcel-forwarding/application/repositories/parcel-forwardings-repository'
import { PrismaParcelForwardingRepository } from './prisma/repositories/prisma-parcel-forwardings-repository'
import { ShippingAddressRepository } from '@/domain/customer/application/repositories/shipping-address-repository'
import { PrismaShippingAddressRepository } from './prisma/repositories/prisma-shipping-address-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CheckInsRepository,
      useClass: PrismaCheckInsRepository,
    },
    {
      provide: ShippingAddressRepository,
      useClass: PrismaShippingAddressRepository,
    },
    {
      provide: ParcelForwardingsRepository,
      useClass: PrismaParcelForwardingRepository,
    },
  ],
  exports: [
    PrismaService,
    CheckInsRepository,
    ParcelForwardingsRepository,
    ShippingAddressRepository,
  ],
})
export class DatabseModule {}
