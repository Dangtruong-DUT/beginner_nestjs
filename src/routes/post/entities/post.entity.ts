import { Exclude } from 'class-transformer'

export class PostEntity {
  id: number
  title: string
  content: string
  @Exclude() authorId: number
  createdAt: Date
  updatedAt: Date
  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial)
  }
}
