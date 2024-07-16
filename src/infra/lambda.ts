import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'

import { AppModule } from './app.module'

let server: Handler

async function bootstrap() {
  try {
    console.log(
      '----------------------- Initializing NestJS application -----------------------',
    )
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    const expressApp = app.getHttpAdapter().getInstance()
    console.log(
      '----------------------- NestJS application initialized -----------------------',
    )
    return serverlessExpress({ app: expressApp })
  } catch (error) {
    console.error('Error during NestJS application initialization:', error)
    throw error
  }
}

export const handler: Handler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('----------------------- Received event:', JSON.stringify(event))
  try {
    server = server ?? (await bootstrap())
    console.log(
      '----------------------- Calling serverless express server -----------------------',
    )
    return server(event, context, callback)
  } catch (error) {
    console.error('Error during handler execution:', error)
    throw error
  }
}
