import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@ObjectType()
export class Message {
  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  timestamp?: string
}

@Resolver()
export class GoodbyeResolver {
  @Query(() => Message)
  @UseGuards(JwtAuthGuard)
  goodbye(): Message {
    return {
      text: 'Goodbye World!',
      timestamp: new Date().toISOString(),
    }
  }
}
