import { sql } from '../lib/db';

export class PostRepository {
  async insert(title: string, description: string, author: string) {
    const result = await sql`
      INSERT INTO "dbBuenasPracticasPoo" (title, description, author)
      VALUES (${title}, ${description}, ${author})
      RETURNING id, title, description, author
    `;
    return result[0];
  }
}