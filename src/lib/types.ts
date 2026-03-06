export type Product = {
  id: number,
  title: string,
  description: string,
  weight: number,
  price: number,
  old_price: number,
  url: string,
  status: "new" | "sale"
}

export type Category = {
  id: number,
  name: string,
  url: string
}

export type Info = {
  id: number,
  title?: string,
  type: "news" | "about" | "assortment",
  text: string,
  media_type: "image" | "video" | "none",
  url?: string,
  link?: string,
}