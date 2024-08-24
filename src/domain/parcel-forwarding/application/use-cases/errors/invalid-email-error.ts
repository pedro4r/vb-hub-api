import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidEmailError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`E-mail "${identifier}" is invalid.`)
  }
}
