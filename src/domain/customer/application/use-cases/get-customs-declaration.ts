import { Either, left, right } from '@/core/either'
import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CustomsDeclarationItemsRepository } from '../repositories/customs-declaration-item-repository'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'

interface GetCustomsDeclarationRequest {
  customsDeclarationId: string
  customerId: string
}

type GetCustomsDeclarationResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    customsDeclaration: CustomsDeclaration
  }
>

export class GetCustomsDeclaration {
  constructor(
    private customsDeclarationRepository: CustomsDeclarationRepository,
    private customsDeclarationItemsRepository: CustomsDeclarationItemsRepository,
  ) {}

  async execute({
    customsDeclarationId,
    customerId,
  }: GetCustomsDeclarationRequest): Promise<GetCustomsDeclarationResponse> {
    const customsDeclaration =
      await this.customsDeclarationRepository.findById(customsDeclarationId)

    if (!customsDeclaration) {
      return left(new ResourceNotFoundError())
    }

    if (customsDeclaration.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const items =
      await this.customsDeclarationItemsRepository.findManyByCustomsDeclarationId(
        customsDeclarationId,
      )

    if (!items) {
      return left(new ResourceNotFoundError())
    }

    customsDeclaration.items = new CustomsDeclarationList(items)

    return right({
      customsDeclaration,
    })
  }
}
