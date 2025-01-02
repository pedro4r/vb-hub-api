import { Resolver, Query } from '@nestjs/graphql'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'

@Resolver()
export class HelloResolver {
  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  hello() {
    return 'Hello World!'
  }
}
