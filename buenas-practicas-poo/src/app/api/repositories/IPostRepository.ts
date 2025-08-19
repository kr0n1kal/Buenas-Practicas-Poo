export interface IPostRepository {
  insert(post: { title: string; description: string; author: string }): Promise<any>;
  getAll(): Promise<any[]>; // <-- Nuevo método
}