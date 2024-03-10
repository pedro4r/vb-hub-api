import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCheckInsRepository } from './prisma/repositories/prisma-check-ins-repository'
import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'
import { ParcelForwardingsRepository } from '@/domain/parcel-forwarding/application/repositories/parcel-forwardings-repository'
import { PrismaParcelForwardingRepository } from './prisma/repositories/prisma-parcel-forwardings-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CheckInsRepository,
      useClass: PrismaCheckInsRepository,
    },
    {
      provide: ParcelForwardingsRepository,
      useClass: PrismaParcelForwardingRepository,
    },
  ],
  exports: [PrismaService, CheckInsRepository, ParcelForwardingsRepository],
})
export class DatabseModule {}
