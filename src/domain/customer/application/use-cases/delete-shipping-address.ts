import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ShippingAddressRepository } from '../repositories/shipping-address-repository'
import { Injectable } from '@nestjs/common'

interface DeleteShippingAddressUseCaseRequest {
  shippingAddressId: string
  customerId: string
}

type DeleteShippingAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
@Injectable()
export class DeleteShippingAddressUseCase {
  constructor(private shippingAddressRepository: ShippingAddressRepository) {}

  async execute({
    shippingAddressId,
    customerId,
  }: DeleteShippingAddressUseCaseRequest): Promise<DeleteShippingAddressUseCaseResponse> {
    // It's necessary to check if the customer has more than one address before deleting it
    const shippingAddresses =
      await this.shippingAddressRepository.findManyByCustomerId(customerId)

    if (shippingAddresses.length === 0) {
      return left(new ResourceNotFoundError('Shipping address not found.'))
    }

    if (customerId !== shippingAddresses[0].customerId.toString()) {
      return left(
        new NotAllowedError('Not allowed to delete this shipping address.'),
      )
    }

    // If the customer has only one address, it is not allowed to delete it
    if (shippingAddresses.length === 1) {
      return left(
        new NotAllowedError(
          'Cannot delete shipping address when you have only one.',
        ),
      )
    }

    const shippingAddress =
      await this.shippingAddressRepository.findById(shippingAddressId)

    if (!shippingAddress) {
      return left(new ResourceNotFoundError())
    }

    await this.shippingAddressRepository.delete(shippingAddress)

    return right(null)
  }
}
