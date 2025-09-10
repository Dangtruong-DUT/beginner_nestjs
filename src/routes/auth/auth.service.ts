import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { RegisterDto } from 'src/routes/auth/auth.dto'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(body: RegisterDto) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword,
        },
      })
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2002') {
        const prismaError = error as Prisma.PrismaClientKnownRequestError & { meta?: { target?: string[] } }
        const errorRes = {
          field: prismaError.meta?.target?.[0] || 'unknown',
          msg: 'Đã tồn tại',
        }
        throw new ConflictException(errorRes)
      }
      throw error
    }
  }
}
