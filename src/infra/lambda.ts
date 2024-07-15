import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'

import { AppModule } from './app.module'

let server: Handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
  context: Context,
  callback: Callback,
) => {
  // Log da função Lambda invocada
  console.log('Lambda function has been invoked')

  // Extrai e loga o caminho e o método da solicitação
  const path = event.path // O caminho da solicitação
  const httpMethod = event.httpMethod // O método HTTP da solicitação
  console.log(`Request path: ${path}, HTTP method: ${httpMethod}`)

  server = server ?? (await bootstrap())
  console.log(server)

  return server(event, context, callback)
}
