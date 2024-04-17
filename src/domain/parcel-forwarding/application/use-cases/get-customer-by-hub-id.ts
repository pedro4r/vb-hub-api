import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomerPreview } from '@/domain/customer/enterprise/entities/value-objects/customer-preview'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'

interface GetCustomerByHubIdUseCaseRequest {
  hubId: number
  parcelForwardingId: string
}

type GetCustomerByHubIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customerPreview: CustomerPreview
  }
>

@Injectable()
export class GetCustomerByHubIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    hubId,
    parcelForwardingId,
  }: GetCustomerByHubIdUseCaseRequest): Promise<GetCustomerByHubIdUseCaseResponse> {
    const customerPreview = await this.customerRepository.findByHubId(hubId)

    if (!customerPreview) {
      return left(new ResourceNotFoundError())
    }

    if (parcelForwardingId !== customerPreview.parcelForwardingId.toString()) {
      return left(new NotAllowedError())
    }

    return right({ customerPreview })
  }
}
