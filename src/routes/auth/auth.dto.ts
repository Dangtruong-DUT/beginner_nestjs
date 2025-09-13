import { Exclude } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'
import { UserEntity } from 'src/routes/auth/entities/user.entity'

export class LoginBodyDto {
  @IsEmail()
  email: string
  @IsString()
  password: string
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString({ message: 'Name must be a string' })
  name: string
  @IsString()
  confirmPassword: string
}

export class LoginResDto {
  accessToken: string
  refreshToken: string
  user: UserEntity
}
