import { connectDB } from './db';
import Activity from '@/models/Activity';

type LogType = 'info' | 'success' | 'warning' | 'error';

export async function logActivity({
  user,
  action,
  type = 'info',
}: {
  user: string;
  action: string;
  type?: LogType;
}) {
  try {
    await connectDB();
    await Activity.create({ user, action, type });
  } catch (error) {
    console.error('❌ Failed to log activity:', error);
  }
}
