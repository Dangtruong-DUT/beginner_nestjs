import { Body, Controller, Post } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { RegisterDto } from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import { UserEntity } from 'src/routes/auth/entities/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body)
    return {
      user: plainToInstance(UserEntity, user),
      message: 'Đăng ký thành công',
    }
  }
}
