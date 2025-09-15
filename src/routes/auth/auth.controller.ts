import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { LoginBodyDto, RegisterBodyDto } from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import { UserEntity } from 'src/routes/auth/entities/user.entity'
import { AuthGuardCondition, AuthGuardType } from 'src/shared/constants/auth.constant'
import { Auth, Public } from 'src/shared/decorators/auth.decorator'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    const user = await this.authService.register(body)
    return {
      user: plainToInstance(UserEntity, user),
      message: 'Đăng ký thành công',
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    const { accessToken, refreshToken, user } = await this.authService.login(body)

    return {
      accessToken,
      refreshToken,
      user: plainToInstance(UserEntity, user),
      message: 'Đăng nhập thành công',
    }
  }

  @Auth({ AuthConditions: AuthGuardCondition.And, AuthTypes: [AuthGuardType.Bearer, AuthGuardType.ApiKey] })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(refreshToken)
    return {
      accessToken,
      refreshToken: newRefreshToken,
      message: 'Làm mới token thành công',
    }
  }
}
