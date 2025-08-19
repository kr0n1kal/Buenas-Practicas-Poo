export interface IPostRepository {
  insert(post: { title: string; description: string; author: string }): Promise<any>;
  getAll(): Promise<any[]>;
  update(id: number, post: { title: string; description: string; author: string }): Promise<any>;
  delete(id: number): Promise<void>; // <-- Nuevo método
}