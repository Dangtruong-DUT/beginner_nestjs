import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import envConfig from 'src/config/envConfig'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from 'src/shared/interceptors/loggingInterceptor.interceptor'
import { TransformInterceptor } from 'src/shared/interceptors/transformInterceptor.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory(errors) {
        return new UnprocessableEntityException(
          errors.map((err) => ({ field: err.property, msg: Object.values(err.constraints || {}).join('') })),
        )
      },
    }),
  )
  await app.listen(envConfig.PORT ?? 3000)
}
bootstrap()
