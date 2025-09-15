import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuardCondition, AuthGuardType } from 'src/shared/constants/auth.constant'
import { AUTH_KEY, AuthOptions, IS_PUBLIC_KEY } from 'src/shared/decorators/auth.decorator'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly apiKeyGuard: ApiKeyGuard,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublicRoute) {
      return true
    }

    const AuthConfig = this.reflector.getAllAndOverride<AuthOptions | undefined>(AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!AuthConfig || AuthConfig.AuthTypes.length === 0) {
      return await this.accessTokenGuard.canActivate(context)
    }

    const { AuthTypes, AuthConditions } = AuthConfig
    const GuardLayers: CanActivate[] = []
    if (AuthTypes.includes(AuthGuardType.Bearer)) GuardLayers.push(this.accessTokenGuard)
    if (AuthTypes.includes(AuthGuardType.ApiKey)) GuardLayers.push(this.apiKeyGuard)

    const guardResults = await Promise.all(
      GuardLayers.map(async (guard) => {
        try {
          return await guard.canActivate(context)
        } catch {
          return false
        }
      }),
    )

    if (AuthConditions === AuthGuardCondition.And && !guardResults.every(Boolean)) {
      throw new UnauthorizedException('Unauthorized request')
    }
    if (AuthConditions === AuthGuardCondition.Or && !guardResults.some(Boolean)) {
      throw new UnauthorizedException('Unauthorized request')
    }

    return true
  }
}
