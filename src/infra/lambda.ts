import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import serverlessExpress from '@vendia/serverless-express'
import { Handler, Context, Callback } from 'aws-lambda'

let server: Handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configuração de CORS adaptada para o Lambda
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.1.237:5173',
      'http://192.168.208.3:5173',
    ],
    credentials: true,
  })

  const configService = app.get(EnvService)
  // No contexto do Lambda, a porta não é diretamente relevante,
  // mas você pode precisar dela para outras configurações
  const port = configService.get('PORT')
  console.log(`Application is configured to run on port: ${port}`)

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
