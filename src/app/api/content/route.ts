import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Content from '@/lib/models/Content';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const filter: any = { 'author.id': session.user.id };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const contents = await Content.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    const content = await Content.create({
      ...body,
      author: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      publishedAt: body.status === 'published' ? new Date() : null,
    });

    return NextResponse.json({ success: true, data: content }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}