import { testDbConnection, pool } from '@/lib/db';

export async function GET() {
  const isConnected = await testDbConnection();

  if (!isConnected) {
    return Response.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    );
  }

  return Response.json({ status: 'ok', message: 'Database is connected' });
}