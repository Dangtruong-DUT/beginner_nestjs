import { plainToClass } from 'class-transformer'
import { IsNumber, IsString, validate } from 'class-validator'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const checkEnvIsExits = async () => {
  if (!fs.existsSync(path.resolve('.env'))) {
    const chalk = (await import('chalk')).default
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    console.log(chalk.red('Error: .env file not found!'))
    process.exit(1)
  }
}

checkEnvIsExits()

export class EnvConfig {
  @IsString()
  DATABASE_URL: string
  @IsNumber()
  PORT: number
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
}

const envConfig = plainToClass(EnvConfig, process.env, {
  enableImplicitConversion: true,
})

validate(envConfig, { whitelist: true }).then(async (errors) => {
  if (errors.length > 0) {
    const chalk = (await import('chalk')).default
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    console.log(chalk.red('Error: .env file validation failed!'))
    errors.forEach((err) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      console.log(chalk.red(`- ${Object.values(err.constraints ?? {}).join(', ')}`))
    })
    process.exit(1)
  }
})

export default envConfig
