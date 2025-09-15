import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostService } from 'src/routes/post/post.service'
import { AuthGuardCondition, AuthGuardType } from 'src/shared/constants/auth.constant'
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
  createPost(@Body() body) {
    return this.postService.createPost(body)
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
