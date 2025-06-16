import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET() {
  await connectDB();
  const existing = await Settings.findOne();
  return NextResponse.json(existing || {});
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  let settings = await Settings.findOne();
  if (settings) {
    Object.assign(settings, body);
    await settings.save();
  } else {
    settings = await Settings.create(body);
  }

  return NextResponse.json(settings);
}
