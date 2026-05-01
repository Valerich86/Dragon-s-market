export type Product = {
  id: number;
  name: string;
  weight: number;
  unit: string;
  description: string;
  composition: string;
  price: number;
  old_price?: number;
  category_id: number;
  remains: number;
  is_active: boolean;
  to_carousel: boolean;
  status: string;
  quantity: number | 0;
};

export type Category = {
  id: number;
  name: string;
};

export type CartItem = {
  id: number;
  customer_id: number;
  product_id: number;
  product_name: string;
  product_weight: number;
  product_unit: string;
  product_category: number;
  quantity: number;
  product_price: number;
  total_price: number;
  cart_total: number;
};

export type Info = {
  id: number;
  title?: string;
  info_type: "news" | "about" | "assortment";
  media_type: "image" | "video" | "none";
  content: string;
  media_url?: string;
  optional_link_url?: string;
  created_at: string;
};

export type Order = {
  // Поля из таблицы orders
  id: number;
  customer_id: number;
  address_id: number | null;
  type: string;
  cart_items: number[];
  total_items: number;
  total_sum: number;
  status:
    | "создан"
    | "в обработке"
    | "подтверждён"
    | "оплачен"
    | "собирается"
    | "готов к отправке"
    | "передан в доставку"
    | "в пути"
    | "доставлен"
    | "завершён"
    | "отменён";
  notes: string | null;
  created_at: string; 
  updated_at: string;

  // Поля из customers
  first_name: string;
  last_name: string;
  phone: string;

  // Поля из addresses (могут быть null, если address_id = NULL)
  city: string | null;
  address: string | null;
  street: string | null;
  house: string | null;
  entrance: string | null; // опечатка сохранена как в исходной схеме
  floor: string | null;
  apartment: string | null;
  intercom_number: string | null;
  postal_code: string | null;
  additional_info: string | null;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_weight: number;
  product_unit: string;
  product_category: number;
  quantity: number;
  product_price: number;
  total_price: number;
};

export type OrderNotification = {
  id: number;
    type: string;
    total_items: number;
    total_sum: number;
    created_at: string;
}

export type User = {
  id: number;
  first_name: string;
  phone: string;
  created_at: string;
  bonus_created_at: string;
  bonus_position_id: number;
  bonus_amount: number;
  bonus_received: boolean;
};

export type Address = {
  id: number;
  customer_id: number;
  country: string;
  city: string;
  street: string;
  house: string;
  entrance: string;
  floor: string;
  apartment: string;
  intercom_number?: string;
  postal_code?: string;
  additional_info?: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
};

export type RegisterFormErrors = {
  first_name?: string[];
  last_name?: string[];
  password?: string[];
  confirmPassword?: string[];
  phone?: string[];
  policy?: string;
};

export type AddressFormErrors = {
  city?: string[];
  street?: string[];
  house?: string[];
  entrance?: string[];
  floor?: string[];
  apartment?: string[];
  intercom_number?: string[];
  additional_info?: string[];
  policy?: string;
};

export interface UploadedFile {
  originalName: string;
  storedName: string;
  size: number;
  url?: string;
}

export interface UploadResponse {
  success: boolean;
  uploadedCount: number;
  files: UploadedFile[];
  error?: string;
}

export interface FileWithMeta {
  file: File;
  buffer: Buffer;
  name: string;
  type: string;
  size: number;
}

export interface QRData {
  userId: string;
  ageVerified: boolean;
  qrData: string;
  timestamp: Date;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  data?: any;
}
