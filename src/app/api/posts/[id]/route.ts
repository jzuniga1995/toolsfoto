// src/app/api/posts/[id]/route.ts
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.select().from(posts).where(eq(posts.id, parseInt(id)));
    
    if (post.length === 0) {
      return Response.json({ error: 'Post no encontrado' }, { status: 404 });
    }
    
    return Response.json(post[0]);
  } catch (error) {
    return Response.json({ error: 'Error obteniendo post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, excerpt, author, image_url } = body;

    const updatedPost = await db.update(posts)
      .set({
        title,
        slug,
        content,
        excerpt,
        author,
        image_url,
        updated_at: new Date(),
      })
      .where(eq(posts.id, parseInt(id)))
      .returning();

    if (updatedPost.length === 0) {
      return Response.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return Response.json(updatedPost[0]);
  } catch (error) {
    return Response.json({ error: 'Error actualizando post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedPost = await db.delete(posts)
      .where(eq(posts.id, parseInt(id)))
      .returning();

    if (deletedPost.length === 0) {
      return Response.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return Response.json({ message: 'Post eliminado' });
  } catch (error) {
    return Response.json({ error: 'Error eliminando post' }, { status: 500 });
  }
}