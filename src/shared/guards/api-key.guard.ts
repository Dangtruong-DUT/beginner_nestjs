import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import envConfig from 'src/config/envConfig'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const apiKey = this.extractApiKeyFromHeader(request)
    if (!apiKey) {
      throw new UnauthorizedException('No API key provided')
    }
    if (apiKey !== envConfig.SECRET_API_KEY) {
      throw new UnauthorizedException('Invalid API key')
    }
    return true
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    return request.headers['x-api-key'] as string | undefined
  }
}
