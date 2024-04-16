import { Body, Controller, Post } from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'

import { Public } from '@/infra/auth/public'

const testBodySchema = z.object({
  message: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(testBodySchema)

type TestBodySchema = z.infer<typeof testBodySchema>

@Controller('/test')
@Public()
export class TestController {
  @Post()
  async handle(@Body(bodyValidationPipe) body: TestBodySchema) {
    const { message } = body

    if (message) {
      return {
        message,
      }
    }
    return {
      message: 'Hello World',
    }
  }
}
