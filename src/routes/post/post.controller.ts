import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CreatePostDto, GetPostDto } from 'src/routes/post/post.dto'
import { PostService } from 'src/routes/post/post.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPost(@ActiveUser('userId') userId: string) {
    const posts = await this.postService.getAllPost(userId)
    return posts.map((post) => plainToInstance(GetPostDto, post))
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
