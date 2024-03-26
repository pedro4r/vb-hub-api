import { Either, left, right } from '@/core/either'

import { DeclarationModelRepository } from '../repositories/declaration-model-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeclarationModelItemsRepository } from '../repositories/declaration-model-item-repository'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { Injectable } from '@nestjs/common'

interface FetchDeclarationModelsUseCaseRequest {
  customerId: string
}

type FetchDeclarationModelsUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | null,
  {
    declarationModels: DeclarationModel[]
  }
>
@Injectable()
export class FetchDeclarationModelsUseCase {
  constructor(
    private declarationModelRepository: DeclarationModelRepository,
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
  ) {}

  async execute({
    customerId,
  }: FetchDeclarationModelsUseCaseRequest): Promise<FetchDeclarationModelsUseCaseResponse> {
    const declarations =
      await this.declarationModelRepository.findManyByCustomerId(customerId)

    if (!declarations) {
      return left(new ResourceNotFoundError())
    }

    if (declarations[0].customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const declarationModels = await Promise.all(
      declarations.map(async (declarationModel) => {
        const items =
          await this.declarationModelItemsRepository.findManyByDeclarationModelId(
            declarationModel.id.toString(),
          )

        if (items) {
          declarationModel.items = new DeclarationModelList(items)
        }

        return declarationModel
      }),
    )

    return right({
      declarationModels,
    })
  }
}
