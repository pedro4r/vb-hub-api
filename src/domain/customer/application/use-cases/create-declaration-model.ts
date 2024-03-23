import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeclarationModelRepository } from '../repositories/declaration-model-repository'
import { DeclarationModelItem } from '../../enterprise/entities/declaration-model-item'
import { DeclarationModel } from '../../enterprise/entities/declaration-model'
import { DeclarationModelList } from '../../enterprise/entities/declaration-model-list'
import { Injectable } from '@nestjs/common'

interface DeclarationModelItems {
  description: string
  value: number
  quantity: number
}
interface CreateDeclarationModelUseCaseRequest {
  customerId: string
  title: string
  declarationModelItems: DeclarationModelItems[]
}

type CreateDeclarationModelUseCaseResponse = Either<
  null,
  {
    declarationModel: DeclarationModel
  }
>
@Injectable()
export class CreateDeclarationModelUseCase {
  constructor(private declarationModelRepository: DeclarationModelRepository) {}

  async execute({
    customerId,
    title,
    declarationModelItems,
  }: CreateDeclarationModelUseCaseRequest): Promise<CreateDeclarationModelUseCaseResponse> {
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
