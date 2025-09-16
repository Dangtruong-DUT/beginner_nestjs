import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { JwtPayload } from 'src/shared/types/jwt.type'

export const ActiveUser = createParamDecorator((field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const activeUser = request[REQUEST_USER_KEY]
  return field ? activeUser?.[field] : activeUser
})
