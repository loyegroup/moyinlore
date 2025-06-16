import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: 'theloyegroup@gmail.com' });
    if (existing) {
      return NextResponse.json({ message: 'Super admin already exists.' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      email: 'theloyegroup@gmail.com',
      password: hashedPassword,
      role: 'superAdmin',
    });

    return NextResponse.json({ message: 'Super admin created.', user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
}
