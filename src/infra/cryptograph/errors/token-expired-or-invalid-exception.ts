import { UnauthorizedException } from '@nestjs/common'

export class TokenExpiredOrInvalidException extends UnauthorizedException {
  constructor() {
    super('Invalid or expired token')
  }
}
