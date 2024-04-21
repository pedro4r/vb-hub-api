import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CustomerPreviewPresenter } from '../../presenters/customer-preview-presenter'
import { FetchCustomersByNameUseCase } from '@/domain/parcel-forwarding/application/use-cases/fetch-customers-by-name'
import { ZodValidationPipe } from '../../pipe/zod-validation-pipe'
import { z } from 'zod'

const routeParamsSchema = z.object({
  name: z.string(),
})

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

const routeParamsValidationPipe = new ZodValidationPipe(routeParamsSchema)
const queryParamsValidationPipe = new ZodValidationPipe(queryParamsSchema)

type RouteParamsSchema = z.infer<typeof routeParamsSchema>
type QueryParamsSchema = z.infer<typeof queryParamsSchema>

@Controller('/customers/:name')
export class FetchCustomersByNameController {
  constructor(
    private fetchCustomersByNameUseCase: FetchCustomersByNameUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(routeParamsValidationPipe) param: RouteParamsSchema,
    @Query(queryParamsValidationPipe) queryParams: QueryParamsSchema,
  ) {
    const userId = user.sub
    const { name } = param
    const { page } = queryParams

    const result = await this.fetchCustomersByNameUseCase.execute({
      parcelForwardingId: userId,
      name,
      page,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        case NotAllowedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const customersPreview = result.value.customersPreview.map((customer) =>
      CustomerPreviewPresenter.toHTTP(customer),
    )

    return {
      customersPreview,
    }
  }
}
