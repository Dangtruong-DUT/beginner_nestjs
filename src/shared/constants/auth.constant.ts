export const REQUEST_USER_KEY = 'decodedAccessToken'

export const AuthGuardType = {
  Bearer: 'bearer',
  ApiKey: 'apiKey',
} as const

export type AuthGuardType = (typeof AuthGuardType)[keyof typeof AuthGuardType]

export const AuthGuardCondition = {
  And: 'and',
  Or: 'or',
} as const

export type AuthGuardConditionType = (typeof AuthGuardCondition)[keyof typeof AuthGuardCondition]
