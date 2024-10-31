import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'

import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

let server: Handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())

  // Configuração do CORS
  app.enableCors({
    origin: [
      'https://www.hubdash.space',
      'http://localhost:5173',
      'http://192.168.1.237:5173',
      'http://172.20.10.2:5173',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  })
  app.use(cookieParser())

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
