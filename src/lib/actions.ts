import { pool } from "./db";

export async function getUserInfo(userId: number) {
  const userData = await pool.query(
    `SELECT * FROM customers WHERE id=$1`, [userId]
  );
  return {
    user: userData.rows[0],
  };
}

export async function getUserAddresses(userId: number) {
  const addressesData = await pool.query(
    `SELECT * FROM customer_addresses WHERE customer_id=$1`, [userId]
  );
  return {
    addresses: addressesData.rows
  };
}
