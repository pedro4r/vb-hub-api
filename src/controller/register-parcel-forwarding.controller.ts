import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class RegisterParcelForwardingController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, initials, email, password } = body

    const userWithSameEmail = await this.prisma.parcelForwarding.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    await this.prisma.parcelForwarding.create({
      data: {
        name,
        initials,
        email,
        password,
      },
    })
  }
}
