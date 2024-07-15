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
  // Loga a inicialização do app
  console.log('NestJS application initialized')
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  // Loga o evento recebido pela função Lambda
  console.log('Received event:', JSON.stringify(event))

  server = server ?? (await bootstrap())
  // Loga a chamada para o servidor express
  console.log('Calling serverless express server')
  return server(event, context, callback)
}
