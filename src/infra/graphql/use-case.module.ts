import { CheckInsStatusMetricsUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-ins-status-metrics'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [CheckInsStatusMetricsUseCase],
  exports: [CheckInsStatusMetricsUseCase],
})
export class UseCasesModule {}
