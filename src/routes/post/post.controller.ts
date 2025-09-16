import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreatePostDto } from 'src/routes/post/post.dto'
import { PostService } from 'src/routes/post/post.service'
import { AuthGuardCondition, AuthGuardType } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { Auth } from 'src/shared/decorators/auth.decorator'

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth({ AuthConditions: AuthGuardCondition.And, AuthTypes: [AuthGuardType.ApiKey, AuthGuardType.Bearer] })
  @Get()
  getAllPost() {
    return this.postService.getAllPost()
  }

  @Post()
  createPost(@Body() body: CreatePostDto, @ActiveUser('userId') userId: string) {
    return this.postService.createPost({ body, userId })
  }

  @Get(':id')
  getPostById(@Param('id') id: string): string {
    return this.postService.getPostById(id)
  }

  @Put(':id')
  updatePost(@Param('id') id: string): string {
    return this.postService.updatePost(id)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): string {
    return this.postService.deletePost(id)
  }
}
