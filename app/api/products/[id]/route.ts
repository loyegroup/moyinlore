import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// ✅ GET - fetch a single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('❌ Get Product Error:', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// ✅ PUT - update a single product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions) as { user?: { role?: string } } | null;
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'superAdmin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await connectDB();

  try {
    const body = await req.json();

    const updated = await Product.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error('❌ Update Product Error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// ✅ DELETE - remove a single product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions) as { user?: { role?: string } } | null;
  if (!session || session.user?.role !== 'superAdmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await connectDB();

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
