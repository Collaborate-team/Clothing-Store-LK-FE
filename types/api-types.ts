// --- Enums ---
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  ONLINE_TRANSFER = 'ONLINE_TRANSFER',
  PAYPAL = 'PAYPAL'
}

export enum Category {
  SHIRTS = 'SHIRTS',
  PANTS = 'PANTS',
  DRESSES = 'DRESSES',
  SHOES = 'SHOES',
  ACCESSORIES = 'ACCESSORIES',
  OUTERWEAR = 'OUTERWEAR',
  ACTIVEWEAR = 'ACTIVEWEAR',
  UNDERWEAR = 'UNDERWEAR',
  SWIMWEAR = 'SWIMWEAR',
  SLEEPWEAR = 'SLEEPWEAR'
}

export enum Color {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  YELLOW = 'YELLOW',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  PINK = 'PINK',
  BROWN = 'BROWN',
  GRAY = 'GRAY',
  NAVY = 'NAVY',
  MAROON = 'MAROON'
}

export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL'
}

export enum StockStatus {
  INSTOCK = 'INSTOCK',
  LOWSTOCK = 'LOWSTOCK',
  OUTOFSTOCK = 'OUTOFSTOCK'
}

// --- DTOs ---

export interface AnalyticsDTO {
  totalRevenue: number;
  activeOrders: number;
  productsInStock: number;
  lowStockProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface CustomerDTO {
  id?: number;
  name: string;
  email: string;
  mobileNo: string;
  address?: string;
}

export interface OrderItemDTO {
  productId: number;
  productName: string;
  imageUrl: string;
  color: Color;
  size: Size;
  qty: number;
  unitPrice: number;
}

export interface OrderDTO {
  id?: number;
  orderId?: string;
  items: OrderItemDTO[];
  paymentMethod: PaymentMethod;
  customerName?: string;
  email?: string;
  mobileNo?: string;
  address?: string;
  total?: number;
  createdAt?: string;
  updateAt?: string;
  orderStatus?: OrderStatus;
}

export interface ProductDto {
  id?: number;
  name: string;
  category: Category;
  price: number;
  quantity?: number;
  sizes: Size[];
  colors: Color[];
  description?: string;
  imageUrls: string[];
  stockStatus: StockStatus;
}
