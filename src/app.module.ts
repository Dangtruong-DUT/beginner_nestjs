import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { PostModule } from 'src/routes/post/post.module'
import { AuthModule } from 'src/routes/auth/auth.module'

@Module({
  imports: [PostModule, SharedModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
