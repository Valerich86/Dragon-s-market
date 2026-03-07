import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// SQL‑запросы для создания таблиц
const createTablesQuery = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    weight INTEGER DEFAULT 0,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    category_id UUID REFERENCES categories(id),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(10),
    to_carousel BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES customers(id),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Россия',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    review_type VARCHAR(20) NOT NULL CHECK (review_type IN ('product', 'store')),
    product_id UUID REFERENCES products(id), 
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    info_type VARCHAR(20) NOT NULL CHECK (info_type IN ('assortment', 'news', 'about')),
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'none')),
    content TEXT NOT NULL,
    media_url VARCHAR(500),
    optional_link_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const createIndexesQuery = `
  -- Индексы для таблицы categories
  CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
  -- Для поиска/фильтрации категорий по названию

  -- Индексы для таблицы products
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  -- Ускорение JOIN с категориями и фильтрации товаров по категории

  CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
  -- Поиск товаров в диапазоне цен

  CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = TRUE;
  -- Быстрый поиск активных товаров (исключаем скрытые)

  CREATE INDEX IF NOT EXISTS idx_products_to_carousel ON products(to_carousel) WHERE to_carousel = TRUE;
  -- Быстрый доступ к товарам для карусели на главной странице

  CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);
  -- Анализ популярных товаров (по остатку на складе)

  -- Индексы для таблицы customers
  CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
  -- Быстрый поиск пользователя по email (авторизация, восстановление пароля)

  CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;
  -- Поиск по телефону (если поле заполнено)

  -- Индексы для таблицы cart_items
  CREATE INDEX IF NOT EXISTS idx_cart_items_customer ON cart_items(customer_id);
  -- Быстрый поиск товаров в корзине конкретного пользователя

  CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);
  -- Анализ популярности товаров в корзинах (какие чаще добавляют)

  -- Индексы для таблицы customer_addresses
  CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON customer_addresses(user_id);
  -- Быстрый поиск адресов пользователя

  CREATE INDEX IF NOT EXISTS idx_customer_addresses_default ON customer_addresses(user_id, is_default) WHERE is_default = TRUE;
  -- Быстрый доступ к основному адресу пользователя (частичный индекс)

  CREATE INDEX IF NOT EXISTS idx_customer_addresses_city ON customer_addresses(city);
  -- Аналитика географии клиентов (по городам)

  -- Индексы для таблицы orders
  CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
  -- Быстрый поиск заказов пользователя

  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  -- Фильтрация заказов по статусу (например, «ожидают оплаты»)

  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
  -- Сортировка заказов по дате (новые первыми)

  CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON orders(total_amount DESC);
  -- Поиск дорогих заказов

  -- Индексы для таблицы order_items
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  -- Быстрый доступ ко всем позициям в заказе

  CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
  -- Анализ продаж товаров (сколько продано через заказы)

  -- Индексы для таблицы reviews
  CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
  -- Быстрый поиск отзывов пользователя

  CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id) WHERE product_id IS NOT NULL;
  -- Быстрый поиск отзывов на конкретный товар (частичный индекс)

  CREATE INDEX IF NOT EXISTS idx_reviews_type ON reviews(review_type);
  -- Разделение отзывов на «про товар» и «про магазин»

  CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
  -- Топ‑отзывы (с высокой оценкой)

  CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
  -- Новые отзывы первыми


  -- Индексы для таблицы info
  CREATE INDEX IF NOT EXISTS idx_info_type ON info(info_type);
  -- Фильтрация информационного блока по типу (ассортимент, новости, о компании)

  CREATE INDEX IF NOT EXISTS idx_info_media_type ON info(media_type);
  -- Группировка по типу медиа (изображение, видео)

  CREATE INDEX IF NOT EXISTS idx_info_created_at ON info(created_at DESC);
  -- Сортировка новостей по дате (новые первыми)
`;

const enteringTestCategories = `
  INSERT INTO categories (name, description, image_url) VALUES
('Японские снеки', 'Чипсы нори, крекеры с васаби, рисовые шарики и другие традиционные японские закуски', 'japanese-snacks.webp'),
('Корейские сладости', 'Рисовые пирожные, конфеты с традиционными вкусами Кореи', 'korean-sweets.webp'),
('Китайские снеки', 'Орехи в карамели, сушёные фрукты, хрустящие водоросли', 'chinese-snacks.webp'),
('Тайские сладости', 'Кокосовые конфеты, манго в сиропе, липкий рис с фруктами', 'thai-sweets.webp'),
('Вьетнамские десерты', 'Рисовые лепёшки, фруктовые рулеты, карамелизованные сладости', 'vietnamese-desserts.webp'),
('Малайзийские сладости', 'Традиционные кетупаты, сладкие кокосовые пудинги', 'malaysian-sweets.webp'),
('Традиционный чай', 'Зелёный чай, улун, пуэр и другие сорта азиатского чая', 'traditional-tea.webp'),
('Газированные напитки Азии', 'Уникальные газировки из Японии, Кореи, Таиланда', 'asian-sodas.webp'),
('Энергетические напитки', 'Азиатские энергетики с женьшенем, гуараной и другими компонентами', 'energy-drinks.webp'),
('Рисовые сладости', 'Моти, данго, другие десерты на основе клейкого риса', 'rice-sweets.webp'),
('Орехи и сухофрукты', 'Жареные орехи, сушёные манго, драконий фрукт и другие', 'nuts-dried-fruits.webp'),
('Морские снеки', 'Сушёные кальмары, рыба в соусе, морские водоросли', 'seafood-snacks.webp');
`;

const enteringTestInfo = `
  INSERT INTO info (title, info_type, content, media_type, media_url, optional_link_url) VALUES
('Велосипед мчится,
Эхо из Изнанки зовёт —
Детство на краю.', 'news', '👺Дела закончились, а сладости продолжаются!

У нас приземлилась легенда! Коллаборация «Очень странных дел»
Kinder уже на базаре - открывай яйцо — лови Демогоргона или Оди,
и беги хвастаться в наш чат — нам тоже интересно, кто там внутри ❤️

❗️Драконье чутьё подсказывает: такое раскупают быстро', 'video', '/video/strange.webm', NULL),

('Ветерок весны —
Бутоны шепчут: «Скоро, скоро…»
Женский день идёт.', 'news', 'СЛАДКИЙ КОНКУРС!

  😳 8 марта близко, а драконы уже раскладывают сокровища:

  🥹 Позиции от "Love is"
  🤤 Нежные японские конфеты
  🤓 Милые баночки с напитками на любой вкус
  — у нас есть всё, чтобы порадовать её. Заходи за лучшими подарками для любимых! А в честь праздника мы объявляем небольшой конкурс, для участия - тыкай кнопку и надейся на удачу!

  😳 Приз победителю: наш фирменный мистери бокс!

  ⏳ Подведение итогов: 10:00 08-03-2026 (Московское время)
  🏆 Призовых мест: 1', 'image', '/images/8_march.webp', 'http://t.me/GiveawayLuckyBot/app?startapp=eKxqkguo-fTN2gkQp'),

('Дракон выбирает:
Манго в сиропе или кацубоси?
Вздох — берёт всё сразу.', 'assortment', 'Наш уютный магазинчик готов удивлять! Вот лишь несколько сокровищ из нашего азиатского ассортимента, которые ждут тебя на полках:

🍡 Моти с топинабуром  — сладковатый, нежный вкус с лёгкими ореховыми нотками.
🍬 Конфеты со вкусом белого персика — сладкие, с лёгкой искринкой, будто загадка в обёртке.
🥭 Манговый мармелад — солнечный, тягучий, с кусочками настоящего манго.
💧Инстаграмнные напитки "Hata" — всем подружкам на зависть!
🍋 Китайские кислые карамельки — для смелых ценителей вкуса!

И это только начало! Каждый вкус — как маленькое путешествие по Азии. Что из этого манит тебя больше всего? 😋', 'none', NULL, NULL),

(NULL, 'assortment', '🔥Соевое мясо — это растительный продукт, сделанный из соевого белка.
    Его текстура напоминает мясо, но оно полностью веганское, лёгкое и универсальное.
    В Азии его называют "текстурированный соевый протеин" или просто "соевое мясо".
    Его обжаривают, тушат, маринуют, добавляют в супы или едят как снэк.
    У нас на Базаре ты найдёшь различное корейское соевое мясо с кунжутом и чили — хрустящее, ароматное и сытное!😍', 'image', '/images/meat.webp', NULL),

(NULL, 'assortment', '🌶️Топоки (или токпокки) — это культовое корейское блюдо, которое покоряет сердце и желудок с первого укуса! Это мягкие рисовые колобки, приготовленные в ярко-красном соусе из корейского чили (гочуджан), с добавлением соевого соуса, сахара и часто специй. Иногда их обжаривают до хрустящей корочки, а иногда подают с рыбными лепёшками или сыром — каждый вариант таит свой характер. В Корее топоки — уличная еда, которую обожают все: от школьников до офисных работников, и это настоящая эмоция в тарелке!


Представь: ты берёшь упаковку сушёных топоки, которые легко приготовить дома и классно проводишь вечер смотря новую серию любимого аниме! Это ли не счастье?😋', 'image', '/images/topoki.webp', NULL),

(NULL, 'assortment', 'Моти — нежные японские рисовые десерты, мягкие, как облако, с сочной начинкой, что тает во рту. На Драконьем Базаре они добавляют магии и восточного шарма в твои дни! Успей схватить — улетают быстрее драконов!
В наличии следующее позиции:

Молочный 🥛: Нежная сливочная классика, уютная, как тёплое утро.
Манго 🥭: Яркий тропический взрыв, сочный и солнечный — лето в каждом кусочке.
Топинамбур 🌱: Натуральная сладость с ореховым послевкусием, полезная и необычная.
Шоколад 🍫: Глубокий, тающий соблазн для ценителей сладкого греха.
Банан 🍌: Кремовый и сладкий, как тёплый тропический бриз — чистое наслаждение.
Персик 🍑: Сочный и ароматный, с лёгкой кислинкой — летний флирт во рту.
Клубника 🍓: Свежий ягодный поцелуй, кисло-сладкий и невероятно нежный.

- Успевай, пока не улетели🔥', 'image', '/images/moti.webp', NULL);

`;

const enteringTestProducts = `
  INSERT INTO products (
  name, weight, description, price, old_price, stock_quantity, category_id, 
  image_url, status, to_carousel) VALUES 

  -- Японские снеки
  ('Чипсы нори Original', 50, 'Классические хрустящие чипсы из морских водорослей', 250.00, 280.00, 100, '6fdb3ec2-824a-47b0-95fa-a8dc39f2b5f4', 'nori.webp', 'sale', TRUE),
  ('Крекеры с васаби', 80, 'Острые крекеры с добавлением настоящего васаби', 180.00, NULL, 75, '6fdb3ec2-824a-47b0-95fa-a8dc39f2b5f4', 'kreckers.webp', 'default', FALSE),
  ('Рисовые шарики с кунжутом', 120, 'Традиционные японские рисовые шарики, обжаренные с кунжутом', 220.00, 240.00, 50, '6fdb3ec2-824a-47b0-95fa-a8dc39f2b5f4', 'shariki.webp', 'sale', FALSE),
  ('Сушёный кальмар с соевым соусом', 60, 'Нежные полоски сушёного кальмара в соевом маринаде', 320.00, NULL, 40, '6fdb3ec2-824a-47b0-95fa-a8dc39f2b5f4', 'calmar.webp', 'default', FALSE),

  -- Корейские сладости
  ('Рисовое пирожное с красной фасолью', 90, 'Мягкое рисовое пирожное с начинкой из сладкой красной фасоли', 190.00, 210.00, 60, '55f59c34-ff75-4ab8-9ee1-c6e0569919e0', 'cake_fasol.webp', 'sale', FALSE),
  ('Корейские конфеты Yujacha', 150, 'Цитрусовые конфеты с ароматом юджа', 280.00, NULL, 80, '55f59c34-ff75-4ab8-9ee1-c6e0569919e0', NULL, 'default', FALSE),
  ('Печенье с мёдом и имбирём', 200, 'Хрустящее печенье с тёплым медово‑имбирным вкусом', 240.00, 260.00, 70, '55f59c34-ff75-4ab8-9ee1-c6e0569919e0', 'cookies_honey.webp', 'sale', FALSE),

  -- Китайские снеки
  ('Орехи в карамели', 180, 'Арахис и кешью в хрустящей карамельной глазури', 350.00, NULL, 90, '63987dae-25b3-43b3-9a17-3d418b4944f6', 'nuts_caramello.webp', 'new', TRUE),
  ('Сушёные манго полоски', 100, 'Натуральные полоски сушёного манго без добавок', 290.00, 320.00, 120, '63987dae-25b3-43b3-9a17-3d418b4944f6', 'mango_slices.webp', 'sale', FALSE),
  ('Хрустящие водоросли', 45, 'Тонкие листы хрустящих морских водорослей с солью', 160.00, NULL, 150, '63987dae-25b3-43b3-9a17-3d418b4944f6', 'Yaki_Sushi.webp', 'default', FALSE),

  -- Тайские сладости
  ('Кокосовые конфеты', 120, 'Нежные конфеты с натуральным кокосовым кремом', 270.00, 300.00, 85, '0d73484a-041a-4d05-9a94-9800921cdd36', 'my_chewy.webp', 'sale', FALSE),
  ('Манго в сиропе', 250, 'Спелое манго в лёгком сахарном сиропе', 380.00, NULL, 65, '0d73484a-041a-4d05-9a94-9800921cdd36', 'mango_sirop.webp', 'default', FALSE),
  ('Липкий рис с фруктами', 180, 'Традиционный десерт из клейкого риса с фруктовыми добавками', 310.00, 340.00, 45, '0d73484a-041a-4d05-9a94-9800921cdd36', 'rice_fruits.webp', 'sale', FALSE),

  -- Вьетнамские десерты
  ('Рисовая лепёшка с кокосом', 110, 'Тонкая рисовая лепёшка с нежными кокосовыми нотками', 210.00, NULL, 70, 'ba899c3d-762a-4a6c-b25d-d6766b6fbc91', 'banh_trang.webp', 'default', FALSE),
  ('Фруктовый рулет с манго', 130, 'Натуральный фруктовый рулет из сушёного манго', 260.00, 290.00, 55, 'ba899c3d-762a-4a6c-b25d-d6766b6fbc91', NULL, 'sale', FALSE),
  ('Карамелизованные бананы', 160, 'Сушёные бананы в карамельной глазури', 230.00, NULL, 80, 'ba899c3d-762a-4a6c-b25d-d6766b6fbc91', 'banans_caramello.webp', 'new', TRUE),

  -- Малайзийские сладости
  ('Кетупат с пальмовым сахаром', 140, 'Традиционные рисовые клецки с пальмовым сахаром', 280.00, 310.00, 40, 'a6fe91a1-55c0-42bc-b38d-b60f67ade0b8', 'ketupat.webp', 'sale', TRUE),
  ('Кокосовый пудинг', 200, 'Нежный пудинг на основе кокосового молока', 320.00, NULL, 60, 'a6fe91a1-55c0-42bc-b38d-b60f67ade0b8', 'puding.webp', 'default', FALSE),

  -- Традиционный чай
  ('Зелёный чай Сенча', 50, 'Японский зелёный чай с тонким травяным ароматом', 450.00, NULL, 30, '7123fdde-1f05-42ca-a1db-5abd7c278df1', 'sencha.webp', 'default', FALSE),
  ('Улун молочный', 100, 'Полуферментированный чай с нежным молочным ароматом', 680.00, 720.00, 25, '7123fdde-1f05-42ca-a1db-5abd7c278df1', 'ulun.webp', 'sale', FALSE),
  ('Пуэр Шу', 357, 'Выдержанный китайский пуэр в прессованном виде', 890.00, NULL, 20, '7123fdde-1f05-42ca-a1db-5abd7c278df1', 'puer_shu.webp', 'default', FALSE),

  -- Газированные напитки Азии
  ('Газировка Ramune', 330, 'Японская газировка в бутылке с шариком', 220.00, 240.00, 100, 'cb90f0df-eccb-4c68-864c-e7448174cd7c', 'ramune.webp', 'sale', TRUE),
  ('Азиатский лимонад Юдзу', 500, 'Освежающий лимонад с цитрусом юдзу', 280.00, NULL, 80, 'cb90f0df-eccb-4c68-864c-e7448174cd7c', 'udzu.webp', 'default', FALSE),
  ('Кола с личи', 330, 'Газировка с экзотическим вкусом личи', 190.00, NULL, 120, 'cb90f0df-eccb-4c68-864c-e7448174cd7c', 'cola_lichy.webp', 'new', TRUE),

  -- Энергетические напитки
  ('Энергетик с женьшенем', 250, 'Тонизирующий напиток с экстрактом женьшеня', 260.00, NULL, 70, '6f709f6a-cb84-4e65-a424-989efa998816', 'energy_ginseng.webp', 'default', FALSE),
  ('Гуарана тропическая', 330, 'Энергетик с экстрактом гуараны и тропическими фруктами', 290.00, 320.00, 60, '6f709f6a-cb84-4e65-a424-989efa998816', 'guarana.webp', 'sale', TRUE),

  -- Рисовые сладости
  ('Моти с клубникой', 150, 'Японские рисовые пирожные с клубничной начинкой', 340.00, 370.00, 50, '30a14566-3784-413b-b0f7-78b9102b8824', 'moti_strawberry.webp', 'sale', FALSE),
  ('Данго с соусом анко', 120, 'Рисовые клёцки с пастой из красной фасоли', 280.00, NULL, 40, '30a14566-3784-413b-b0f7-78b9102b8824', 'dango.webp', 'default', FALSE),
  ('Рисовый пирог с кунжутом', 180, 'Традиционный японский десерт с чёрным кунжутом', 310.00, NULL, 35, '30a14566-3784-413b-b0f7-78b9102b8824', NULL, 'default', FALSE),

  -- Орехи и сухофрукты
  ('Жареный кешью', 200, 'Отборные кешью, обжаренные до золотистого цвета', 520.00, NULL, 45, '4b42c522-cd05-4911-9073-694b3567de18', 'keshiu.webp', 'default', FALSE),
  ('Сушёный драконий фрукт', 150, 'Экзотические кусочки питахайи', 480.00, 510.00, 30, '4b42c522-cd05-4911-9073-694b3567de18', 'dragonfruit.webp', 'sale', FALSE),

  -- Морские снеки
  ('Сушёный кальмар с васаби', 80, 'Острые полоски сушёного кальмара с пикантным васаби', 380.00, 420.00, 60, '7171c3a7-9ece-4bee-9802-eee777e80774', 'calmar_vasabi.webp', 'sale', FALSE),
  ('Хрустящие анчоусы', 50, 'Маринованные анчоусы в хрустящей панировке', 290.00, NULL, 85, '7171c3a7-9ece-4bee-9802-eee777e80774', 'anchous.webp', 'default', FALSE),
  ('Кольца кальмара в соевом соусе', 120, 'Нежные кольца кальмара, маринованные в азиатском соевом соусе', 450.00, NULL, 40, '7171c3a7-9ece-4bee-9802-eee777e80774', NULL, 'default', FALSE),
  ('Сушёные креветки с чили', 70, 'Ароматные креветки с острым тайским чили', 410.00, 440.00, 55, '7171c3a7-9ece-4bee-9802-eee777e80774', 'krevetka.webp', 'sale', FALSE)
  `;

export async function GET() {
  try {
    await pool.query("BEGIN");
    // await pool.query(createTablesQuery);
    // await pool.query(createIndexesQuery);
    // await pool.query(enteringTestCategories);
    await pool.query(enteringTestProducts);
    // await pool.query(enteringTestInfo);
    await pool.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Таблицы созданы, данные внесены",
      },
      { status: 200 },
    );
  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await pool.query("ROLLBACK");
    console.error("Ошибка при создании таблиц:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при создании таблиц и индексов",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
