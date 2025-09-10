import { Exclude } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @IsEmail()
  email: string
  @IsString()
  password: string
}

export class RegisterDto extends LoginDto {
  @IsString({ message: 'Name must be a string' })
  name: string
  @IsString()
  confirmPassword: string
}
