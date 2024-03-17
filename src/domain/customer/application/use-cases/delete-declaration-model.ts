import { Either, left, right } from '@/core/either'
import { DeclarationModelRepository } from '../repositories/declaration-model-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'

interface DeleteDeclarationModelRequest {
  customerId: string
  declarationModelId: string
}

type DeleteDeclarationModelResponse = Either<
  null | ResourceNotFoundError | NotAllowedError,
  {
    declarationModel: DeclarationModel
  }
>

export class DeleteDeclarationModel {
  constructor(private declarationModelRepository: DeclarationModelRepository) {}

  async execute({
    customerId,
    declarationModelId,
  }: DeleteDeclarationModelRequest): Promise<DeleteDeclarationModelResponse> {
    const declarationModel =
      await this.declarationModelRepository.findById(declarationModelId)

    if (!declarationModel) {
      return left(new ResourceNotFoundError())
    }

    if (declarationModel.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    await this.declarationModelRepository.delete(declarationModel)

    return right({
      declarationModel,
    })
  }
}
