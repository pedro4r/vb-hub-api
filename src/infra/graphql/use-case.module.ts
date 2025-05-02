import { CheckInsStatusMetricsUseCase } from '@/domain/parcel-forwarding/application/use-cases/check-ins-status-metrics'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { FilterCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins'
import { FilterPackagesUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-packages'
import { FilterCheckInsDetailsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins-details'
import { GetCustomerByHubIdUseCase } from '@/domain/parcel-forwarding/application/use-cases/get-customer-by-hub-id'
import { FetchShippingAddressUseCase } from '@/domain/customer/application/use-cases/fetch-shipping-address'
import { FetchDeclarationModelsUseCase } from '@/domain/customer/application/use-cases/fetch-declaration-model'

@Module({
  imports: [DatabaseModule],
  providers: [
    CheckInsStatusMetricsUseCase,
    FilterCheckInsUseCase,
    FilterCheckInsDetailsUseCase,
    FilterPackagesUseCase,
    GetCustomerByHubIdUseCase,
    FetchShippingAddressUseCase,
    FetchDeclarationModelsUseCase,
  ],
  exports: [
    CheckInsStatusMetricsUseCase,
    FilterCheckInsUseCase,
    FilterCheckInsDetailsUseCase,
    FilterPackagesUseCase,
    GetCustomerByHubIdUseCase,
    FetchShippingAddressUseCase,
    FetchDeclarationModelsUseCase,
  ],
})
export class UseCasesModule {}
