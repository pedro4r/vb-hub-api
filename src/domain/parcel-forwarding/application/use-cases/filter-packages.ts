import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { PackageRepository } from '@/domain/customer/application/repositories/package-repository'
import { PackageStatus } from '@/domain/customer/enterprise/entities/package'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FilteredPackagesData } from '../../enterprise/entities/value-objects/filtered-packages'

interface FilterPackagesUseCaseRequest {
  parcelForwardingId: string
  customerName?: string
  hubId?: number
  packageStatus?: PackageStatus
  startDate?: Date
  endDate?: Date
  page: number
}

type FilterPackagesUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    packagesData: FilteredPackagesData
  }
>
@Injectable()
export class FilterPackagesUseCase {
  constructor(
    private packageRepository: PackageRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    parcelForwardingId,
    customerName,
    hubId,
    packageStatus,
    startDate,
    endDate,
    page,
  }: FilterPackagesUseCaseRequest): Promise<FilterPackagesUseCaseResponse> {
    const customersId: UniqueEntityID[] = []
    if (hubId) {
      const customerData = await this.customerRepository.findByHubId(hubId)
      // Check if the customer is associated with the parcel forwarding
      if (
        !customerData ||
        !customerData.parcelForwardingId.equals(
          new UniqueEntityID(parcelForwardingId),
        )
      ) {
        return left(new ResourceNotFoundError('Check-ins not found.'))
      }
      customersId.push(customerData.customerId)
    } else if (customerName) {
      const customersData = await this.customerRepository.findManyByName(
        customerName,
        parcelForwardingId,
      )

      // Check if the customer is associated with the parcel forwarding
      if (
        customersData &&
        !customersData.customers[0].parcelForwardingId.equals(
          new UniqueEntityID(parcelForwardingId),
        )
      ) {
        return left(new ResourceNotFoundError('Check-ins not found.'))
      }

      customersData.customers.forEach((customer) => {
        customersId.push(customer.customerId)
      })
    }

    const packagesData = await this.packageRepository.findManyByFilter(
      parcelForwardingId,
      page,
      customersId.map((id) => id.toString()),
      packageStatus,
      startDate,
      endDate,
    )

    if (packagesData.packages.length === 0) {
      return left(new ResourceNotFoundError('No packages found.'))
    }

    if (
      parcelForwardingId !==
      packagesData.packages[0].parcelForwardingId.toString()
    ) {
      return left(
        new NotAllowedError('You are not allowed to access this resource.'),
      )
    }

    return right({ packagesData })
  }
}
