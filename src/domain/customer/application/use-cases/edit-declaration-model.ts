import { Either, left, right } from '@/core/either'
import { DeclarationModelRepository } from '../repositories/declaration-model-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeclarationModelItem } from '../../enterprise/entities/declaration-model-item'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { DeclarationModelItemsRepository } from '../repositories/declaration-model-item-repository'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { Injectable } from '@nestjs/common'

interface EditDeclarationModelUseCaseRequest {
  declarationModelId: string
  customerId: string
  title: string
  items: {
    id: string
    declarationModelId: string
    description: string
    value: number
    quantity: number
  }[]
}

type EditDeclarationModelUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    declarationModel: DeclarationModel
  }
>
@Injectable()
export class EditDeclarationModelUseCase {
  constructor(
    private declarationModelRepository: DeclarationModelRepository,
    private declarationModelItemsRepository: DeclarationModelItemsRepository,
  ) {}

  async execute({
    declarationModelId,
    customerId,
    title,
    items,
  }: EditDeclarationModelUseCaseRequest): Promise<EditDeclarationModelUseCaseResponse> {
    const currentDeclarationModel =
      await this.declarationModelRepository.findById(declarationModelId)

    if (!currentDeclarationModel) {
      return left(new ResourceNotFoundError())
    }

    if (currentDeclarationModel.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const currentDeclarationModelItems =
      await this.declarationModelItemsRepository.findManyByDeclarationModelId(
        declarationModelId,
      )

    if (!currentDeclarationModelItems) {
      return left(new ResourceNotFoundError())
    }

    const customDeclarationItemsList = new DeclarationModelList(
      currentDeclarationModelItems,
    )

    const declarationModelItems = items.map((item) => {
      return DeclarationModelItem.create(
        {
          declarationModelId: new UniqueEntityID(declarationModelId),
          description: item.description,
          value: item.value,
          quantity: item.quantity,
        },
        new UniqueEntityID(item.id),
      )
    })

    customDeclarationItemsList.update(declarationModelItems)

    const declarationModel = DeclarationModel.create(
      {
        customerId: new UniqueEntityID(customerId),
        title,
      },
      new UniqueEntityID(declarationModelId),
    )

    declarationModel.items = customDeclarationItemsList

    await this.declarationModelRepository.save(declarationModel)

    return right({
      declarationModel,
    })
  }
}
