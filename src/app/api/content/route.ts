import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/lib/models/Content';

// GET all content
export async function GET() {
  try {
    await dbConnect();
    const contents = await Content.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST new content
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const content = await Content.create(body);
    return NextResponse.json({ success: true, data: content }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}