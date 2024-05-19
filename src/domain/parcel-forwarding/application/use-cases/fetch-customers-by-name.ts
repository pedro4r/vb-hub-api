import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { FetchCustomerByNameData } from '@/domain/customer/enterprise/entities/value-objects/fetch-customers-by-name-data'

interface FetchCustomersByNameUseCaseRequest {
  name: string
  page: number
  parcelForwardingId: string
}

type FetchCustomersByNameUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customersData: FetchCustomerByNameData
  }
>

@Injectable()
export class FetchCustomersByNameUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    name,
    page,
    parcelForwardingId,
  }: FetchCustomersByNameUseCaseRequest): Promise<FetchCustomersByNameUseCaseResponse> {
    const customersData = await this.customerRepository.findManyByName(
      name,
      parcelForwardingId,
      page,
    )

    if (customersData.customers.length === 0) {
      return left(new ResourceNotFoundError())
    }

    if (
      parcelForwardingId !==
      customersData.customers[0].parcelForwardingId.toString()
    ) {
      return left(new NotAllowedError())
    }

    return right({ customersData })
  }
}
