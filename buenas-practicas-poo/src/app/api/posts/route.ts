import { NextResponse, NextRequest } from 'next/server';
import { PostService } from '../services/PostService';
import { PostgresPostRepository } from '../repositories/PostgresPostRepository';

const repository = new PostgresPostRepository();
const service = new PostService(repository);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await service.createPost(data);
    if (result.error) return NextResponse.json(result.error, { status: 400 });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: String(err) }, { status: 400 });
  }
}

// Nuevo endpoint GET para todos los posts
export async function GET(req: NextRequest) {
  try {
    const result = await service.getAllPosts();
    if (result.error) return NextResponse.json(result.error, { status: 400 });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: String(err) }, { status: 400 });
  }
}