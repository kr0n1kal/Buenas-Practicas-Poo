import { IPostRepository } from './IPostRepository';
import { sql } from '../lib/db';

export class PostgresPostRepository implements IPostRepository {
  async insert(post: { title: string; description: string; author: string }) {
    const result = await sql`
      INSERT INTO "dbBuenasPracticasPoo" (title, description, author)
      VALUES (${post.title}, ${post.description}, ${post.author})
      RETURNING id, title, description, author
    `;
    return result[0];
  }
}