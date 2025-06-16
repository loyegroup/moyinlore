import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { config } from 'dotenv';
config(); // load .env.local

async function seedSuperAdmin() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('✅ Super admin already exists.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin123', 10);
  const user = await User.create({
    email: 'theloyegroup@gmail.com',
    password: hashed,
    role: 'superAdmin',
  });

  console.log('✅ Super admin created:', user.email);
  process.exit(0);
}

seedSuperAdmin();
// Handle any errors during the seeding process