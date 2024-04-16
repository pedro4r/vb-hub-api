import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomerPreview } from '@/domain/customer/enterprise/entities/value-objects/customer-preview'
import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'

interface GetCustomerByCodeUseCaseRequest {
  customerCode: number
  parcelForwardingId: string
}

type GetCustomerByCodeUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customerPreview: CustomerPreview
  }
>

@Injectable()
export class GetCustomerByCodeUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    customerCode,
    parcelForwardingId,
  }: GetCustomerByCodeUseCaseRequest): Promise<GetCustomerByCodeUseCaseResponse> {
    const customerPreview =
      await this.customerRepository.findByCustomerCode(customerCode)

    if (!customerPreview) {
      return left(new ResourceNotFoundError())
    }

    if (parcelForwardingId !== customerPreview.parcelForwardingId.toString()) {
      return left(new NotAllowedError())
    }

    return right({ customerPreview })
  }
}
