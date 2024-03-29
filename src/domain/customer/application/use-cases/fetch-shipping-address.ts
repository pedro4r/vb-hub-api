import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ShippingAddressRepository } from '../repositories/shipping-address-repository'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'
import { Injectable } from '@nestjs/common'

interface FetchShippingAddressUseCaseRequest {
  customerId: string
}

type FetchShippingAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    shippingAddresses: ShippingAddress[]
  }
>
@Injectable()
export class FetchShippingAddressUseCase {
  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async execute({
    customerId,
  }: FetchShippingAddressUseCaseRequest): Promise<FetchShippingAddressUseCaseResponse> {
    const shippingAddresses =
      await this.shippingAddressRepository.findManyByCustomerId(customerId)

    if (!shippingAddresses) {
      return left(new ResourceNotFoundError('No shipping addresses found.'))
    }

    if (customerId !== shippingAddresses[0]?.customerId.toString()) {
      return left(
        new NotAllowedError(
          'You are not allowed to fetch these shipping addresses.',
        ),
      )
    }

    return right({
      shippingAddresses,
    })
  }
}
