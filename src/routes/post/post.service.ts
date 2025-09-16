import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePostDto, UpdatePostDto } from 'src/routes/post/post.dto'
import { isRecordNotFoundPrismaError } from 'src/shared/helpers'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  getAllPost(userId: string) {
    return this.prismaService.post.findMany({
      where: {
        authorId: Number(userId),
      },
      include: {
        author: true,
      },
    })
  }

  createPost({ body, userId }: { body: CreatePostDto; userId: string }) {
    return this.prismaService.post.create({
      data: {
        title: body.title || '',
        content: body.content || '',
        authorId: Number(userId),
      },
      include: {
        author: true,
      },
    })
  }

  async getPostById(id: string) {
    try {
      const post = await this.prismaService.post.findUniqueOrThrow({
        where: { id: Number(id) },
        include: {
          author: true,
        },
      })

      return post
    } catch (error) {
      if (isRecordNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  async updatePost({ id, body, userId }: { id: string; body: UpdatePostDto; userId: string }): Promise<string> {
    try {
      await this.prismaService.post.update({
        where: { id: Number(id), authorId: Number(userId) },
        data: {
          title: body.title,
          content: body.content,
        },
      })
      return `update post ${id} successfully`
    } catch (error) {
      if (isRecordNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }
  async deletePost(id: string): Promise<string> {
    try {
      await this.prismaService.post.delete({
        where: { id: Number(id) },
      })
      return `delete post ${id} successfully`
    } catch (error) {
      if (isRecordNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }
}
