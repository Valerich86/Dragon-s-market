import {Pool} from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function testDbConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Подключение к БД успешно установлено');
    console.log('Текущее время в БД:', res.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    return false;
  } 
}


