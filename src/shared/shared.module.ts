import { Global, Module } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'src/shared/guards/Auth.guard'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'

const sharedServices = [PrismaService, HashingService, TokenService]
@Global()
@Module({
  providers: [
    ...sharedServices,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AccessTokenGuard,
    ApiKeyGuard,
  ],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
