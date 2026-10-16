export interface Subcategory {
  title: string;
  slug: string;
  id: string;
}

export interface Category {
  title: string;
  slug: string;
  id: string;
  subcategories?: Subcategory[];
}

export interface CART {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  subCategory?: string;
  discount?: number;
  imageUrl: string;
  benefits?: string[];
  stock: number;
  brand?: string;
  sku?: string;
  etiquette?: string;
  description?: string;
  usage?: string;
}
