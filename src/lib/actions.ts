import { useCloudPath } from "./cloud";
import { pool } from "./db";

export async function getUserInfo(userId: number) {
  const userData = await pool.query(`SELECT id, first_name, phone, created_at FROM customers WHERE id=$1`, [
    userId,
  ]);
  const addressesData = await pool.query(
    `SELECT * FROM customer_addresses WHERE customer_id=$1`,
    [userId],
  );
  return {
    user: {
      general: userData.rows[0],
      addresses: addressesData.rows,
    }
  };
}

export async function getAddress(addressId: number) {
  const addressesData = await pool.query(
    `SELECT * FROM customer_addresses WHERE id=$1`,
    [addressId],
  );
  return {
    address: addressesData.rows[0]
  };
}

export async function getAllProductsAndCategoriesForCatalog() {
  const categoriesData = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
  const productsData = await pool.query(
    `SELECT * FROM products WHERE remains>0 AND is_active=TRUE ORDER BY name ASC`,
  );
  const cloudPath = useCloudPath();
  const categories =categoriesData.rows;
  categories.unshift({id: 0, name: "Все"});
  return {
    catalog: {
      categories: categories,
      products: productsData.rows,
      cloudPath: cloudPath
    }
  };
}
