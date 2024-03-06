import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipe/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createCheckInBodySchema = z.object({
  details: z.string(),
  weight: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createCheckInBodySchema)

type CreateCheckInBodySchema = z.infer<typeof createCheckInBodySchema>

@Controller('/check-in')
@UseGuards(JwtAuthGuard)
export class CreateCheckInController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCheckInBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { details, weight } = body
    const userId = user.sub

    await this.prisma.checkIn.create({
      data: {
        parcel_forwarding_id: userId,
        customer_id: '951a88f8-a4f9-42ce-83b1-afa20ab0d9e6',
        details,
        weight,
      },
    })
  }
}
