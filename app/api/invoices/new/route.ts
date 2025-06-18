import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Invoice from '@/models/Invoice';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const invoice = await Invoice.create(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error('❌ Failed to create invoice:', err);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
