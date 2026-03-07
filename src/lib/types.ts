export type Product = {
  id: number;
  name: string;
  weight?: number;
  description: string;
  price: number;
  old_price?: number;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  to_carousel: boolean;
  status: "new" | "sale" | "default";
};

export type Category = {
  id: number;
  name: string;
  description: string;
  image_url: string;
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
  id: string;
  customer_id: string;
  total_amount: number;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  notes: string;
  created_at: string;
  updated_at: string;
};
