import { SetMetadata } from '@nestjs/common'
import { AuthGuardConditionType, AuthGuardType } from 'src/shared/constants/auth.constant'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export type AuthOptions = {
  AuthTypes: AuthGuardType[]
  AuthConditions: AuthGuardConditionType
}

export const AUTH_KEY = 'auth'
export const Auth = (options: AuthOptions) => SetMetadata(AUTH_KEY, options)
