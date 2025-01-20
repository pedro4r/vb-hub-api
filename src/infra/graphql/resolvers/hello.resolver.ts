import { Resolver, Query } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Resolver()
export class HelloResolver {
  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  hello() {
    return 'Hello World!'
  }
}
