import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RegisterParcelForwardingController } from './controller/register-parcel-forwarding.controller'

@Module({
  controllers: [RegisterParcelForwardingController],
  providers: [PrismaService],
})
export class AppModule {}
