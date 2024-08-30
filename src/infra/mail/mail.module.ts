import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { EmailService } from '@/core/email/email-service'
import { NestMailerEmailService } from './mailer-service'

@Module({
  imports: [
    ConfigModule,
    EnvModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule, EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => {
        return {
          transport: {
            host: envService.get('SMTP_HOST'), // Host do servidor SMTP
            port: envService.get('SMTP_PORT'), // Porta do servidor SMTP
            secure: envService.get('SMTP_SECURE'), // true para 465, false para outras portas
            auth: {
              user: envService.get('SMTP_USER'), // Usuário SMTP
              pass: envService.get('SMTP_PASS'), // Senha SMTP
            },
          },
        }
      },
    }),
  ],
  providers: [
    EnvService,
    { provide: EmailService, useClass: NestMailerEmailService },
  ],
  exports: [EmailService],
})
export class MailModule {}
