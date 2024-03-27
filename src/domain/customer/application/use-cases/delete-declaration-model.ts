import { Either, left, right } from '@/core/either'
import { DeclarationModelRepository } from '../repositories/declaration-model-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { Injectable } from '@nestjs/common'

interface DeleteDeclarationModelUseCaseRequest {
  customerId: string
  declarationModelId: string
}

type DeleteDeclarationModelUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    declarationModel: DeclarationModel
  }
>
@Injectable()
export class DeleteDeclarationModelUseCase {
  constructor(private declarationModelRepository: DeclarationModelRepository) {}

  async execute({
    customerId,
    declarationModelId,
  }: DeleteDeclarationModelUseCaseRequest): Promise<DeleteDeclarationModelUseCaseResponse> {
    const declarationModel =
      await this.declarationModelRepository.findById(declarationModelId)

    if (!declarationModel) {
      return left(new ResourceNotFoundError('DeclarationModel not found'))
    }

    if (declarationModel.customerId.toString() !== customerId) {
      return left(
        new NotAllowedError(
          'You are not allowed to delete this DeclarationModel',
        ),
      )
    }

    await this.declarationModelRepository.delete(declarationModel)

    return right({
      declarationModel,
    })
  }
}
