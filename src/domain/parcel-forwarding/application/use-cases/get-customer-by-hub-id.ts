import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomerDetails } from '@/domain/customer/enterprise/entities/value-objects/customer-details'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'

interface GetCustomerByHubIdUseCaseRequest {
  hubId: number
  parcelForwardingId: string
}

type GetCustomerByHubIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customerDetails: CustomerDetails
  }
>

@Injectable()
export class GetCustomerByHubIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    hubId,
    parcelForwardingId,
  }: GetCustomerByHubIdUseCaseRequest): Promise<GetCustomerByHubIdUseCaseResponse> {
    const customerDetails = await this.customerRepository.findByHubId(hubId)

    if (!customerDetails) {
      return left(new ResourceNotFoundError())
    }

    if (parcelForwardingId !== customerDetails.parcelForwardingId.toString()) {
      return left(new NotAllowedError())
    }

    return right({ customerDetails })
  }
}
