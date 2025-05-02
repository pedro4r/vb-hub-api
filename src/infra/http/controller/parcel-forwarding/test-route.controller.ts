import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
} from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import { FilterCheckInsUseCase } from '@/domain/parcel-forwarding/application/use-cases/filter-check-ins'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CheckInPresenter } from '../../presenters/check-in-presenter'

@Controller('/test')
@Public()
export class TestController {
  constructor(private FilterCheckIns: FilterCheckInsUseCase) {}
  @Get()
  async handle() {
    const result = await this.FilterCheckIns.execute({
      parcelForwardingId: '3009842e-0800-4590-8be9-6378c941e8db',
      page: 1,
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

    const checkInsPreview = CheckInPresenter.toHTTP(result.value.checkInsData)

    return {
      checkInsPreview,
    }

    // try {
    //   // Fazendo uma requisição HTTP para testar a conectividade com a internet
    //   const response = await axios.get('https://www.google.com', {
    //     timeout: 5000, // Tempo limite de 5 segundos
    //   })
    //   // Se a requisição for bem-sucedida, retornar o status da resposta
    //   return {
    //     message: 'Internet connectivity test successful!!!',
    //     status: response.status,
    //   }
    // } catch (error) {
    //   let errorMessage: string
    //   if (error instanceof Error) {
    //     // Now TypeScript knows `error` is an Error, so accessing `message` is safe
    //     errorMessage = error.message
    //   } else {
    //     // If it's not an Error, we can't be sure `message` exists, so provide a default
    //     errorMessage = 'An unknown error occurred!!!'
    //   }
    //   return {
    //     message: 'Internet connectivity test failed!!!',
    //     error: errorMessage,
    //   }
    // }
  }
}
