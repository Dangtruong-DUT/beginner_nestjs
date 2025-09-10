import { Injectable } from '@nestjs/common'
import { hash, compare, genSalt } from 'bcrypt'

@Injectable()
export class HashingService {
  async hash(value: string): Promise<string> {
    const salt = await genSalt(10)

    return hash(value, salt)
  }
  compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue)
  }
}
