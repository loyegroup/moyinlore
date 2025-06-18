import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  await connectDB();
  const products = await Product.find().populate('bundleWith');
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const newProduct = await Product.create(body);
  return NextResponse.json(newProduct, { status: 201 });
}
