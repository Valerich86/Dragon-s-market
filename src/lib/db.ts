import {Pool} from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true //проверка SSL-сертификата 
  },
});

export async function testDbConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT NOW()');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    return false;
  } 
}


