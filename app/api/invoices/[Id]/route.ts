import { connectDB } from '@/lib/db';
import Invoice from '@/models/Invoice';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    // ✅ Log the incoming invoice ID
    console.log('🔍 Trying to delete invoice with ID:', params.id);

    const deleted = await Invoice.findByIdAndDelete(params.id);

    // ✅ Log whether deletion happened
    if (!deleted) {
      console.log('⚠️ Invoice not found in DB. Maybe wrong ID or already deleted.');
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // ✅ Log the deleted document
    console.log('✅ Invoice deleted successfully:', deleted);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Delete Invoice Error:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
