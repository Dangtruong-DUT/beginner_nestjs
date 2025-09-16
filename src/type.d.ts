import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { JwtPayload } from 'src/shared/types/jwt.type'

declare module 'express' {
  interface Request {
    [REQUEST_USER_KEY]?: JwtPayload
  }
}
