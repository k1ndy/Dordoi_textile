// Общие типы данных проекта

export type Gender = "men" | "women" | "kids" | "unisex";
export type Season = "all" | "summer" | "winter" | "demi";

export interface Category {
  id: string;
  slug: string;
  title: string;
  emoji?: string;
  order: number;
  hidden: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  gender: Gender;
  type: string; // тип товара (футболка, худи и т.д.)
  season: Season;
  material: string;
  countryOfOrigin: string;
  sizes: string[];
  colors: string[];
  images: string[];
  priceRetail: number; // в сомах (базовая валюта)
  priceWholesale: number;
  minWholesale: number; // минимальный заказ для опта (шт)
  inStock: boolean;
  isNew: boolean;
  isHit: boolean;
  hidden: boolean;
  deliveryCountries: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

// 6 типов заявок под бизнес-сценарии.
export type LeadType =
  | "retail_order"
  | "wholesale_request"
  | "large_wholesale_request"
  | "marketplace_seller_request"
  | "manufacturing_request"
  | "general_contact";

// Единый набор статусов, покрывающий все воронки (розница/опт/селлеры/отшив).
export type LeadStatus =
  | "new"
  | "contacted"
  | "processing"
  | "quote_sent"
  | "negotiation"
  | "prepaid"
  | "paid"
  | "in_production"
  | "shipped"
  | "completed"
  | "rejected";

export interface Lead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  name: string;
  phone: string;
  messenger?: string; // WhatsApp / Telegram
  company?: string;
  country?: string;
  city?: string;
  product?: string;
  category?: string;
  size?: string;
  color?: string;
  quantity?: string;
  budget?: string;
  sellChannel?: string; // где продаёт (для селлеров)
  needBranding?: boolean;
  needLabelPack?: boolean;
  comment?: string;
  // Сценарные доп-поля (площадка, ткань, лекала, логотип, сроки и т.д.)
  details?: Record<string, string>;
  // Работа менеджера
  manager?: string;
  managerNotes?: string;
  lastContactAt?: string;
  createdAt: string;
}

export interface SiteSettings {
  shopName: string;
  logoUrl?: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  address: string;
  deliveryCountries: string[];
  paymentTerms: string;
  deliveryTerms: string;
  heroText: string;
  heroImages: string[]; // фото в шапке главной (4 шт)
}
