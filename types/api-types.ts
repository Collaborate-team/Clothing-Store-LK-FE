// --- Enums ---
export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH'
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

export interface OrderItemRequestDTO {
  productId: number;
  quantity: number;
}

export interface OrderDTO {
  id?: number;
  orderId?: string;
  items: OrderItemRequestDTO[];
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
