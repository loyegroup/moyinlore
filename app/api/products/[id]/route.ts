import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; // ✅ connect to MongoDB
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superAdmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await connectDB(); // ✅ ensure MongoDB is connected before delete

  try {
    const deleted = await Product.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('❌ Delete Product Error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
