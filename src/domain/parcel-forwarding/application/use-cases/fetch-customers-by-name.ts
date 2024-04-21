import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomerPreview } from '@/domain/customer/enterprise/entities/value-objects/customer-preview'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'

interface FetchCustomersByNameUseCaseRequest {
  name: string
  page: number
  parcelForwardingId: string
}

type FetchCustomersByNameUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customersPreview: CustomerPreview[]
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
    const customersPreview = await this.customerRepository.findManyByName(
      name,
      page,
    )

    if (customersPreview.length === 0) {
      return left(new ResourceNotFoundError())
    }

    if (
      parcelForwardingId !== customersPreview[0].parcelForwardingId.toString()
    ) {
      return left(new NotAllowedError())
    }

    return right({ customersPreview })
  }
}
