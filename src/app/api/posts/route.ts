// src/app/api/posts/route.ts
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.published_at));
    return Response.json(allPosts);
  } catch (error) {
    return Response.json({ error: 'Error obteniendo posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, author, image_url } = body;

    const newPost = await db.insert(posts).values({
      title,
      slug,
      content,
      excerpt,
      author,
      image_url,
    }).returning();

    return Response.json(newPost[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Error creando post' }, { status: 500 });
  }
}