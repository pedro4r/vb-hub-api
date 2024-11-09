import { Controller, Get } from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import axios from 'axios'

@Controller('/test')
@Public()
export class TestController {
  @Get()
  async handle() {
    try {
      // Fazendo uma requisição HTTP para testar a conectividade com a internet
      const response = await axios.get('https://www.google.com', {
        timeout: 5000, // Tempo limite de 5 segundos
      })

      // Se a requisição for bem-sucedida, retornar o status da resposta
      return {
        message: 'Internet connectivity test successful',
        status: response.status,
      }
    } catch (error) {
      let errorMessage: string
      if (error instanceof Error) {
        // Now TypeScript knows `error` is an Error, so accessing `message` is safe
        errorMessage = error.message
      } else {
        // If it's not an Error, we can't be sure `message` exists, so provide a default
        errorMessage = 'An unknown error occurred'
      }

      return {
        message: 'Internet connectivity test failed',
        error: errorMessage,
      }
    }
  }
}
