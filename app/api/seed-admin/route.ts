import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();

  const email = 'moyinlore@gmail.com';
  const password = 'admin12345';
  const name = 'Admin';

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'admin', // Normal admin, not superadmin
  });

  return NextResponse.json({ message: 'Admin account created successfully' });
}
// This route seeds the database with an initial admin user