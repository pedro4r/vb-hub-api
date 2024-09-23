import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.1.237:5173',
      'http://172.20.10.2:5173',
    ],
    credentials: true,
  })

  const configService = app.get(EnvService)
  const port = configService.get('PORT')
  await app.listen(port)
}

bootstrap()
