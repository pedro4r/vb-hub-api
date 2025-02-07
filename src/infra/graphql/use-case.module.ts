import { CheckInsStatusMetricsUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-ins-status-metrics'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { FilterCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins'
import { FilterPackagesUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-packages'
import { FilterCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins-details'

@Module({
  imports: [DatabaseModule],
  providers: [
    CheckInsStatusMetricsUseCase,
    FilterCheckInsUseCase,
    FilterCheckInsDetailsUseCase,
    FilterPackagesUseCase,
  ],
  exports: [
    CheckInsStatusMetricsUseCase,
    FilterCheckInsUseCase,
    FilterCheckInsDetailsUseCase,
    FilterPackagesUseCase,
  ],
})
export class UseCasesModule {}
