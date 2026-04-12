import { useCloudPath } from "./cloud";
import { pool } from "./db";
import type { CartItem } from "./types";

export async function getUserInfo(userId: number) {
  try {
    const userData = await pool.query(
      `SELECT id, first_name, phone, created_at FROM customers WHERE id=$1`,
      [userId],
    );
    const addressesData = await pool.query(
      `SELECT * FROM addresses WHERE customer_id=$1`,
      [userId],
    );
    return {
      user: {
        general: userData.rows[0],
        addresses: addressesData.rows,
      },
    };
  } catch (error) {
    console.error("Ошибка получения данных пользователя: ", error);
    return { user: null };
  }
}

export async function getAddress(addressId: number) {
  try {
    const addressesData = await pool.query(
      `SELECT * FROM addresses WHERE id=$1`,
      [addressId],
    );
    return {
      address: addressesData.rows[0],
    };
  } catch (error) {
    console.error("Ошибка получения адреса: ", error);
    return { address: null };
  }
}

export async function getCategories() {
  try {
    const data = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
    const categories = data.rows;
    categories.unshift({ id: 0, name: "Все" });
    return { categories: categories };
  } catch (error) {
    console.error("Ошибка получения категорий: ", error);
    return { categories: [] };
  }
}

export async function getCloudPath() {
  return useCloudPath();
}

interface GetCartResult {
  cart: CartItem[];
}

export async function getCart(userId: number): Promise<GetCartResult> {
  if (userId !== 0) {
    try {
      const data = await pool.query(
        `SELECT ci.*, p.name AS product_name, p.weight AS product_weight, 
        p.unit AS product_unit, p.price AS product_price, SUM(ci.total_price) OVER () AS cart_total
        FROM cart_items AS ci JOIN products AS p ON ci.product_id=p.id 
        WHERE ci.customer_id=$1 ORDER BY ci.created_at`,
        [userId],
      );
      return { cart: data.rows };
    } catch (error) {
      console.error("Ошибка получения корзины: ", error);
    }
  }
  return { cart: [] };
}

export async function getCatalog(userId: number, categoryId: number) {
  const { cart } = await getCart(userId);
  let products = [];
  let query: string;
  let params: number[] = [];

  if (categoryId === 0) {
    query = `SELECT * FROM products WHERE remains>0 AND is_active=TRUE ORDER BY name ASC`;
    params = [];
  } else {
    query = `SELECT * FROM products WHERE remains>0 AND is_active=TRUE AND category_id=$1 ORDER BY name ASC`;
    params = [categoryId];
  }
  try {
    const productsData = await pool.query(query, params);
    products = productsData.rows;
    for (let p of products) {
      const cartItem = cart.find((c) => c.product_id === p.id);
      p.quantity = cartItem ? cartItem.quantity : 0;
    }
    return { catalog: products };
  } catch (error) {
    console.error("Ошибка получения товаров: ", error);
    return { catalog: [] };
  }
}

export async function getProductOfADay() {
  const data = await pool.query(
    `SELECT * FROM products 
    WHERE status=$1 AND is_active=TRUE AND remains>0 
    ORDER BY updated_at`,
    ["productOfADay"],
  );
  return { product: data.rows[data.rows.length - 1] };
}

export async function getProductData(id: number, userId: number) {
  try {
    const productData = await pool.query(`SELECT * FROM products WHERE id=$1`, [
      id,
    ]);
    let product = productData.rows[0];
    const cartData = await pool.query(
      `SELECT * FROM cart_items WHERE product_id=$1 AND customer_id=$2`,
      [id, userId],
    );
    if (cartData.rows.length > 0) {
      product.quantity = cartData.rows[0].quantity;
    } else {
      product.quantity = 0;
    }
    return { product: product };
  } catch (error) {
    console.error("Ошибка получения товара: ", error);
    return { product: null }
  }
}
