// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();
    
    if (!path) {
      return NextResponse.json(
        { error: 'Path es requerido' },
        { status: 400 }
      );
    }

    revalidatePath(path);
    
    return NextResponse.json({ 
      revalidated: true, 
      path,
      now: Date.now() 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidando', details: (error as Error).message },
      { status: 500 }
    );
  }
}