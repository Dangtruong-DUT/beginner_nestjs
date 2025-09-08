import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostService } from 'src/routes/post/post.service'

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
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
