import { PostRepository } from '../repositories/PostRepository';
import { Title } from '../value-objects/Title';
import { Description } from '../value-objects/Description';
import { Author } from '../value-objects/Author';

export class PostService {
  constructor(private repository: PostRepository) {}

  async createPost(data: { title: string; description: string; author: string }) {
    try {
      // Value Objects handle the validation
      const title = Title.create(data.title);
      const description = Description.create(data.description);
      const author = Author.create(data.author);

      const inserted = await this.repository.insert(title.value, description.value, author.value);
      return { success: true, inserted };
    } catch (err) {
      return { error: { message: (err as Error).message }, status: 400 };
    }
  }
}