import { Controller, Get } from '@nestjs/common'
import { Public } from '@/infra/auth/public'

@Controller('/test')
@Public()
export class TestController {
  @Get()
  handle() {
    return {
      message: 'API response received successfully',
    }
  }
}
