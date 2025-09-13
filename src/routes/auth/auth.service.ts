import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { LoginBodyDto, LoginResDto, RegisterBodyDto } from 'src/routes/auth/auth.dto'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDto) {
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

  async login(body: LoginBodyDto): Promise<LoginResDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      throw new UnprocessableEntityException({ field: 'email', msg: 'Email không tồn tại' })
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordValid) {
      throw new UnprocessableEntityException({ field: 'password', msg: 'Mật khẩu không chính xác' })
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id)
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiredAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })

    return {
      accessToken,
      refreshToken,
      user,
    }
  }

  async generateTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId }),
      this.tokenService.signRefreshToken({ userId }),
    ])
    return { accessToken, refreshToken }
  }
}
