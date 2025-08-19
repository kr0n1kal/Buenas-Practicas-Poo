import { IPostRepository } from '../repositories/IPostRepository';
import { Title } from '../value-objects/Title';
import { Description } from '../value-objects/Description';
import { Author } from '../value-objects/Author';

interface PostData {
  title: string;
  description: string;
  author: string;
}

export class PostService {
  constructor(private repository: IPostRepository) {}

  async createPost(data: PostData) {
    try {
      const title = Title.create(data.title);
      const description = Description.create(data.description);
      const author = Author.create(data.author);

      const inserted = await this.repository.insert({
        title: title.value,
        description: description.value,
        author: author.value,
      });

      return { success: true, inserted };
    } catch (err) {
      return { error: { message: (err as Error).message }, status: 400 };
    }
  }

  // Nuevo método para obtener todos los posts
  async getAllPosts() {
    try {
      const posts = await this.repository.getAll();
      return { success: true, posts };
    } catch (err) {
      return { error: { message: (err as Error).message }, status: 400 };
    }
  }
}