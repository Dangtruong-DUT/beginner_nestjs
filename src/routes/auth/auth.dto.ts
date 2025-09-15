import { IsEmail, IsString } from 'class-validator'
import { UserEntity } from 'src/routes/auth/entities/user.entity'
import { OmitType } from '@nestjs/mapped-types'
import { IsMatch } from 'src/shared/decorators/custom-validator.decorator'
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
  @IsMatch('password', { message: 'Confirm password does not match' })
  confirmPassword: string
}

export class LoginResDto {
  accessToken: string
  refreshToken: string
  user: UserEntity
}

export class RefreshTokenBodyDto {
  @IsString()
  refreshToken: string
}

export class RefreshTokenResDto extends OmitType(LoginResDto, ['user'] as const) {}
