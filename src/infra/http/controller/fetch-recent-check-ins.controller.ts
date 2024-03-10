import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipe/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-recent-check-ins'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CheckInPresenter } from '../presenters/check-in-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/check-ins')
@UseGuards(JwtAuthGuard)
export class FetchRecentCheckInsController {
  constructor(private fetchRecentCheckIns: FetchRecentCheckInsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = user.sub
    const result = await this.fetchRecentCheckIns.execute({
      parcelForwardingId: userId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const checkIns = result.value.checkIns

    return { checkIns: checkIns.map(CheckInPresenter.toHTTP) }
  }
}
