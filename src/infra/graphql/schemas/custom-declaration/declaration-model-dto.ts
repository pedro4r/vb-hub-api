import { DeclarationModel } from '@/domain/customer/enterprise/entities/declaration-model'
import { Field, ObjectType } from '@nestjs/graphql'
import { DeclarationModelItemDTO } from './declaration-model-item-dto'

@ObjectType()
export class DeclarationModelDTO {
  @Field(() => String)
  title: string

  @Field(() => String)
  customerId: string

  @Field(() => [DeclarationModelItemDTO])
  items: DeclarationModelItemDTO[]

  static fromDomain(model: DeclarationModel[]): DeclarationModelDTO[] {
    return model.map((model) => {
      return {
        title: model.title,
        customerId: model.customerId.toString(),
        items: DeclarationModelItemDTO.fromDomain(model.items),
      }
    })
  }
}
