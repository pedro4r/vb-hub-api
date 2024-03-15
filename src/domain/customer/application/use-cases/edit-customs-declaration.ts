import { Either, left, right } from '@/core/either'
import { CustomsDeclaration } from '../../enterprise/entities/customs-declaration'
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CustomsDeclarationItem,
  CustomsDeclarationItemProps,
} from '../../enterprise/entities/customs-declaration-item'
import { CustomsDeclarationItemsRepository } from '../repositories/customs-declaration-item-repository'
import { CustomsDeclarationList } from '../../enterprise/entities/customs-declaration-list'

interface EditCustomsDeclarationRequest {
  customsDeclarationId: string
  customerId: string
  title: string
  items: {
    props: CustomsDeclarationItemProps
    id: string
  }[]
}

type EditCustomsDeclarationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customsDeclaration: CustomsDeclaration
  }
>

export class EditCustomsDeclaration {
  constructor(
    private customsDeclarationRepository: CustomsDeclarationRepository,
    private customsDeclarationItemsRepository: CustomsDeclarationItemsRepository,
  ) {}

  async execute({
    customsDeclarationId,
    customerId,
    title,
    items,
  }: EditCustomsDeclarationRequest): Promise<EditCustomsDeclarationResponse> {
    const currentCustomsDeclaration =
      await this.customsDeclarationRepository.findById(customsDeclarationId)

    if (!currentCustomsDeclaration) {
      return left(new ResourceNotFoundError())
    }

    if (currentCustomsDeclaration.customerId.toString() !== customerId) {
      return left(new NotAllowedError())
    }

    const currentCustomsDeclarationItems =
      await this.customsDeclarationItemsRepository.findManyByCustomsDeclarationId(
        customsDeclarationId,
      )

    if (!currentCustomsDeclarationItems) {
      return left(new ResourceNotFoundError())
    }

    const customDeclarationItemsList = new CustomsDeclarationList(
      currentCustomsDeclarationItems,
    )

    const customsDeclarationItems = items.map((item) => {
      return CustomsDeclarationItem.create(
        {
          description: item.props.description,
          value: item.props.value,
          quantity: item.props.quantity,
        },
        new UniqueEntityID(item.id),
      )
    })

    customDeclarationItemsList.update(customsDeclarationItems)

    const customsDeclaration = CustomsDeclaration.create(
      {
        customerId: new UniqueEntityID(customerId),
        title,
      },
      new UniqueEntityID(customsDeclarationId),
    )

    customsDeclaration.items = customDeclarationItemsList

    await this.customsDeclarationRepository.save(customsDeclaration)

    return right({
      customsDeclaration,
    })
  }
}
