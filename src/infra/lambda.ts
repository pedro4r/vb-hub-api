import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'

import { AppModule } from './app.module'

let server: Handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())

  // Configuração do CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.1.237:5173',
      'http://192.168.1.209',
    ],
    methods: '*',
    allowedHeaders: 'Content-Type, Authorization, x-requested-with, accept',
    credentials: true,
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
