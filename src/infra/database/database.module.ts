import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCheckInsRepository } from './prisma/repositories/prisma-check-ins-repository'
import { CheckInsRepository } from '@/domain/parcel-forwarding/application/repositories/check-ins-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CheckInsRepository,
      useClass: PrismaCheckInsRepository,
    },
  ],
  exports: [PrismaService, CheckInsRepository],
})
export class DatabseModule {}
