import { Either, left, right } from '@/core/either'
import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteCustomsDeclarationRequest {
  customerId: string
  packageId: string
}

type DeleteCustomsDeclarationResponse = Either<
  null | ResourceNotFoundError | NotAllowedError,
  {
    customsDeclaration: CustomsDeclaration
  }
>

export class DeleteCustomsDeclaration {
  constructor(
    private customsDeclarationRepository: CustomsDeclarationRepository,
  ) {}

  async execute({
    customerId,
    packageId,
  }: DeleteCustomsDeclarationRequest): Promise<DeleteCustomsDeclarationResponse> {
    const customsDeclaration =
      await this.customsDeclarationRepository.findById(packageId)

    if (!customsDeclaration) {
      return left(new ResourceNotFoundError())
    }

    if (customsDeclaration.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    await this.customsDeclarationRepository.delete(packageId)

    return right({
      customsDeclaration,
    })
  }
}
