import { PostValidator } from '../validators/PostValidator';
import { PostRepository } from '../repositories/PostRepository';

export class PostService {
  private validator = PostValidator;
  private repository: PostRepository;

  constructor(repository: PostRepository) {
    this.repository = repository;
  }

  async createPost(data: any) {
    const validationError = this.validator.runAll(data);
    if (validationError) return { error: validationError, status: 400 };

    const inserted = await this.repository.insert(data.title, data.description, data.author);
    return { success: true, inserted };
  }
}