import { Either, left, right } from '@/core/either'

import { DeclarationModelRepository } from '../repositories/declaration-model-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeclarationModelItemsRepository } from '../repositories/declaration-model-item-repository'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'

interface GetDeclarationModelRequest {
  declarationModelId: string
  customerId: string
}

type GetDeclarationModelResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    declarationModel: DeclarationModel
  }
>

export class GetDeclarationModel {
  constructor(
    private declarationModelRepository: DeclarationModelRepository,
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
  ) {}

  async execute({
    declarationModelId,
    customerId,
  }: GetDeclarationModelRequest): Promise<GetDeclarationModelResponse> {
    const declarationModel =
      await this.declarationModelRepository.findById(declarationModelId)

    if (!declarationModel) {
      return left(new ResourceNotFoundError())
    }

    if (declarationModel.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const items =
      await this.declarationModelItemsRepository.findManyByDeclarationModelId(
        declarationModelId,
      )

    if (!items) {
      return left(new ResourceNotFoundError())
    }

    declarationModel.items = new DeclarationModelList(items)

    return right({
      declarationModel,
    })
  }
}
