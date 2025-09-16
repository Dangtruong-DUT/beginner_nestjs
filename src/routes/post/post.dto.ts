import { Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { UserEntity } from 'src/routes/auth/entities/user.entity'
import { PostEntity } from 'src/routes/post/entities/post.entity'

export class CreatePostDto {
  @IsString()
  title: string
  @IsString()
  content: string
}

export class GetPostDto extends PostEntity {
  @Type(() => UserEntity)
  author: UserEntity
}
