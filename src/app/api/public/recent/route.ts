import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/lib/models/Content';

export async function GET() {
  try {
    await dbConnect();
    const contents = await Content.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('title slug excerpt featuredImage createdAt views author tags');
    
    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}