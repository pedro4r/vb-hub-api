import { Either, left, right } from '@/core/either'
import { ShippingAddressRepository } from '../repositories/shipping-address-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ShippingAddress } from '../../enterprise/entities/shipping-address'

interface GetShippingAddressUseCaseRequest {
  customerId: string
  shippingAddressId: string
}

type GetShippingAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    shippingAddress: ShippingAddress
  }
>

export class GetShippingAddressUseCase {
  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async execute({
    customerId,
    shippingAddressId,
  }: GetShippingAddressUseCaseRequest): Promise<GetShippingAddressUseCaseResponse> {
    const shippingAddress =
      await this.shippingAddressRepository.findById(shippingAddressId)

    if (!shippingAddress) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== shippingAddress.customerId.toString()) {
      return left(new NotAllowedError())
    }

    return right({
      shippingAddress,
    })
  }
}
