import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Invoice from '@/models/Invoice';

export async function GET() {
  try {
    await connectDB();
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('❌ Failed to fetch invoices:', error);
    return NextResponse.json({ error: 'Failed to load invoices' }, { status: 500 });
  }
}
