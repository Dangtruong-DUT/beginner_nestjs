import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import envConfig from 'src/config/envConfig'
import { JwtPayload } from 'src/shared/types/jwt.type'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  signAccessToken(payload: { userId: number }) {
    return this.jwtService.signAsync(payload, {
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
      secret: envConfig.ACCESS_TOKEN_SECRET,
      algorithm: 'HS256',
    })
  }

  signRefreshToken(payload: { userId: number }) {
    return this.jwtService.signAsync(payload, {
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
      secret: envConfig.REFRESH_TOKEN_SECRET,
      algorithm: 'HS256',
    })
  }

  verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    })
  }

  verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
    })
  }
}
