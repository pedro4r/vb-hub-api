import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'

import { AppModule } from './app.module'

let server: Handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  // Configuração de CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Ou use '*' para permitir todas as origens
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  })

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
  server = server ?? (await bootstrap())
  return server(event, context, callback)
}
