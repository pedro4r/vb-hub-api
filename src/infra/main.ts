import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  })

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.1.237:5173',
      'http://192.168.208.3:5173',
    ],
    credentials: true,
  })

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
