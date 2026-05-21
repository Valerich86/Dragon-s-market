import { useCloudPath } from "./cloud";
import { pool } from "./db";
import type { CartItem, Content } from "./types";
import type { Product } from "./types";

//массив категорий для плана скидок
export const weekDaysCategories = [
  { title: "Товары понедельника", dayNumber: 1, categories: [9, 10] },
  { title: "Товары вторника", dayNumber: 2, categories: [2, 3, 21] },
  { title: "Товары среды", dayNumber: 3, categories: [7, 28] },
  { title: "Товары четверга", dayNumber: 4, categories: [25, 6] },
  { title: "Товары пятницы", dayNumber: 5, categories: [1, 8, 22] },
  { title: "Товары субботы", dayNumber: 6, categories: [11, 12, 5, 16] },
  { title: "Товары воскресенья", dayNumber: 7, categories: [26, 23, 30] },
];

// получение данных конкретного пользователя
export async function getUserInfo(userId: number) {
  try {
    const userData = await pool.query(`SELECT * FROM customers WHERE id=$1`, [
      userId,
    ]);
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

export type BonusResult = {
  mascotPositionId: number;
  showMascot: boolean;
};

// получение параметров бонуса
export async function getBonusParams(
  userId: number,
  catalog: Product[],
): Promise<BonusResult> {
  if (userId === 0) return { mascotPositionId: 0, showMascot: false };
  const randomIndex = Math.floor(Math.random() * catalog.length);
  let currentPosition: 0;
  // const newPosition = 717;
  const newPosition = catalog[randomIndex].id;
  try {
    const data = await pool.query(
      `SELECT bonus_amount, bonus_created_at, bonus_position_id, bonus_received FROM customers WHERE id=$1`,
      [userId],
    );
    const customer = data.rows[0];
    currentPosition = customer.bonus_position_id;
    if (customer.bonus_created_at) {
      // Преобразуем даты в число миллисекунд с 1970-01-01
      const bonusCreatedAtMs = new Date(customer.bonus_created_at).getTime();
      const nowMs = new Date().getTime();

      // 12 часов в миллисекундах
      const twelveHoursMs = 12 * 60 * 60 * 1000;

      // Разница во времени в миллисекундах
      const timeDiffMs = nowMs - bonusCreatedAtMs;

      if (timeDiffMs >= twelveHoursMs) {
        await pool.query(
          `UPDATE customers SET bonus_created_at = NOW(), bonus_received=false, bonus_position_id=$2 WHERE id=$1`,
          [userId, newPosition],
        );
        return { mascotPositionId: newPosition, showMascot: true };
      } else if (timeDiffMs < twelveHoursMs && !customer.bonus_received) {
        return { mascotPositionId: currentPosition, showMascot: true };
      } else {
        return { mascotPositionId: 0, showMascot: false };
      }
    } else {
      await pool.query(
        `UPDATE customers SET bonus_created_at = NOW(), bonus_received=false, bonus_position_id=$2 WHERE id=$1`,
        [userId, newPosition],
      );
      return { mascotPositionId: newPosition, showMascot: true };
    }
  } catch (error) {
    console.error("Ошибка получения данных пользователя: ", error);
    return { mascotPositionId: 0, showMascot: false };
  }
}

// получение конкретного адреса
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

// получение всех категорий
export async function getCategories() {
  const today = new Date().getDay();
  let newTitle = "";
  for (const day of weekDaysCategories) {
    if (day.dayNumber === today) {
      newTitle = day.title;
    }
  }
  try {
    const data = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
    const categories = data.rows;
    categories.unshift({ id: 0, name: newTitle });
    return { categories: categories };
  } catch (error) {
    console.error("Ошибка получения категорий: ", error);
    return { categories: [] };
  }
}

// получение пути для облачного хранилища
export async function getCloudPath() {
  return useCloudPath();
}

interface GetCartResult {
  cart: CartItem[];
}

// получение корзины пользователя
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

// получение каталога товаров
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
    if (categoryId === 0)
      products = [...productsData.rows].sort(() => Math.random() - 0.5);
    return { catalog: products };
  } catch (error) {
    console.error("Ошибка получения товаров: ", error);
    return { catalog: [] };
  }
}

// получение товаров категорий дня
export async function getDiscountedProducts(userId: number) {
  const { cart } = await getCart(userId);
  let products: Product[] = [];
  let title = "";
  const today = new Date().getDay();
  await pool.query("BEGIN");
  try {
    for (const day of weekDaysCategories) {
      if (day.dayNumber === today) {
        title = day.title;
        for (const c of day.categories) {
          const result = await pool.query(
            `SELECT * FROM products WHERE remains>0 AND is_active=TRUE AND category_id=$1 ORDER BY name ASC`,
            [c],
          );
          Array.prototype.push.apply(products, result.rows);
        }
      }
    }
    await pool.query("COMMIT");
    for (let p of products) {
      const cartItem = cart.find((c) => c.product_id === p.id);
      p.quantity = cartItem ? cartItem.quantity : 0;
    }
    products = [...products].sort(() => Math.random() - 0.5);
    return { products: products, title: title };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Ошибка получения товаров: ", error);
    return { products: [], title: title };
  }
}

// получение товара дня
export async function getProductOfADay() {
  try {
    const data = await pool.query(
      `SELECT * FROM products 
    WHERE status=$1 AND is_active=TRUE AND remains>0 
    ORDER BY updated_at`,
      ["productOfADay"],
    );
    return { product: data.rows[data.rows.length - 1] };
  } catch (error) {
    console.error("Ошибка получения данных: ", error);
    return { product: null };
  }
}

// получение контента по типу
export async function getContent(type: string, limit?: number) {
  try {
    let query = `SELECT * FROM content WHERE type=$1 ORDER BY created_at DESC`;
    let params: (string | number)[] = [type];
    if (limit) {
      query += ` LIMIT $2`;
      params.push(limit);
    }
    const data = await pool.query(query, params);
    return { content: data.rows };
  } catch (error) {
    console.error("Ошибка получения данных: ", error);
    return { content: [] };
  }
}

// получение контента по id
export async function getOneFromContent(id: number) {
  try {
    const data = await pool.query(`SELECT * FROM content WHERE id=$1;`, [id]);
    return { content: data.rows[0] };
  } catch (error) {
    console.error("Ошибка получения данных: ", error);
    return { content: null };
  }
}

// получение политики ОПД
export async function getPrivacyPolicy() {
  try {
    const data = await pool.query(`SELECT * FROM privacy_policy`);
    return { data: data.rows[0] };
  } catch (error) {
    console.error("Ошибка получения данных: ", error);
    return { content: null };
  }
}

// получение одного товара с проверкой наличия в корзине
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
    return { product: null };
  }
}


