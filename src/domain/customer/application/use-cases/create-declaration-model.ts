import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeclarationModelRepository } from '../repositories/declaration-model-repository'
import {
  DeclarationModelItem,
  DeclarationModelItemProps,
} from '../../enterprise/entities/declaration-model-item'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
interface CreateDeclarationModelRequest {
  customerId: string
  title: string
  declarationModelItems: DeclarationModelItemProps[]
}

type CreateDeclarationModelResponse = Either<
  null,
  {
    declarationModel: DeclarationModel
  }
>

export class CreateDeclarationModel {
  constructor(private declarationModelRepository: DeclarationModelRepository) {}

  async execute({
    customerId,
    title,
    declarationModelItems,
  }: CreateDeclarationModelRequest): Promise<CreateDeclarationModelResponse> {
    const declarationModel = DeclarationModel.create({
      customerId: new UniqueEntityID(customerId),
      title,
    })

    const items = declarationModelItems.map((item) => {
      return DeclarationModelItem.create({
        declarationModelId: declarationModel.id,
        description: item.description,
        value: item.value,
        quantity: item.quantity,
      })
    })

    declarationModel.items = new DeclarationModelList(items)

    await this.declarationModelRepository.create(declarationModel)

    return right({
      declarationModel,
    })
  }
}
