import { Either, left, right } from '@/core/either'
import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface GetCustomsDeclarationRequest {
  customerId: string
  packageId: string
}

type GetCustomsDeclarationResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    customsDeclaration: CustomsDeclaration
  }
>

export class GetCustomsDeclaration {
  constructor(
    private customDeclarationRepository: CustomsDeclarationRepository,
  ) {}

  async execute({
    customerId,
    packageId,
  }: GetCustomsDeclarationRequest): Promise<GetCustomsDeclarationResponse> {
    const customsDeclaration =
      await this.customDeclarationRepository.findById(packageId)

    if (!customsDeclaration) {
      return left(new ResourceNotFoundError())
    }

    if (customsDeclaration.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    return right({
      customsDeclaration,
    })
  }
}
