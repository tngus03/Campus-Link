import { NextResponse } from 'next/server';
import getSession from '@/lib/session';
import db from '@/lib/db';

export async function GET() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      posts: true,
      Comment: {
        include: {
          post: true,
        },
      },
    },
  });

  return NextResponse.json({
    username: user?.username,
    posts: user?.posts || [],
    comments: user?.Comment || [],
  });
}
