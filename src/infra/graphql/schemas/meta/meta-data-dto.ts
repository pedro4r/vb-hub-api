import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Meta {
  @Field(() => Int)
  pageIndex: number

  @Field(() => Int)
  perPage: number

  @Field(() => Int)
  totalCount: number
}
