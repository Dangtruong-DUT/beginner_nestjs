import { Injectable } from '@nestjs/common'
import { CreatePostDto } from 'src/routes/post/post.dto'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  getAllPost() {
    return this.prismaService.post.findMany()
  }

  createPost({ body, userId }: { body: CreatePostDto; userId: string }) {
    return this.prismaService.post.create({
      data: {
        title: body.title || '',
        content: body.content || '',
        authorId: Number(userId),
      },
    })
  }

  getPostById(id: string): string {
    return `This will return a post by id: ${id}`
  }

  updatePost(id: string): string {
    return `This will update a post by id: ${id}`
  }
  deletePost(id: string): string {
    return `This will delete a post by id: ${id}`
  }
}
