import { Either, left, right } from '@/core/either'
import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CustomsDeclarationItemsRepository } from '../repositories/customs-declaration-item-repository'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'

interface FetchCustomsDeclarationsRequest {
  customerId: string
}

type FetchCustomsDeclarationsResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    customsDeclarations: CustomsDeclaration[]
  }
>

export class FetchCustomsDeclarations {
  constructor(
    private customsDeclarationRepository: CustomsDeclarationRepository,
    private customsDeclarationItemsRepository: CustomsDeclarationItemsRepository,
  ) {}

  async execute({
    customerId,
  }: FetchCustomsDeclarationsRequest): Promise<FetchCustomsDeclarationsResponse> {
    const declarations =
      await this.customsDeclarationRepository.findManyByCustomerId(customerId)

    if (!declarations) {
      return left(new ResourceNotFoundError())
    }

    if (declarations[0].customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const customsDeclarations = await Promise.all(
      declarations.map(async (customsDeclaration) => {
        const items =
          await this.customsDeclarationItemsRepository.findManyByCustomsDeclarationId(
            customsDeclaration.id.toString(),
          )

        if (items) {
          customsDeclaration.items = new CustomsDeclarationList(items)
        }

        return customsDeclaration
      }),
    )

    return right({
      customsDeclarations,
    })
  }
}
