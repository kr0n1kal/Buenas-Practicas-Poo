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

  async getAll(): Promise<any[]> {
    const posts = await sql`SELECT id, title, description, author FROM "dbBuenasPracticasPoo" ORDER BY id DESC`;
    return posts;
  }

  async update(id: number, post: { title: string; description: string; author: string }) {
  const result = await sql`
    UPDATE "dbBuenasPracticasPoo"
    SET title = ${post.title}, description = ${post.description}, author = ${post.author}
    WHERE id = ${id}
    RETURNING id, title, description, author
  `;
  return result[0];
  }

  async delete(id: number): Promise<void> {
  await sql`
    DELETE FROM "dbBuenasPracticasPoo"
    WHERE id = ${id}
  `;
  }
}