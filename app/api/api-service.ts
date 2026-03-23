import axiosInstance from '../api/axios-instance';
import { 
  ProductDto, 
  OrderDTO, 
  CustomerDTO, 
  AnalyticsDTO 
} from '../../types/api-types';

const IMAGE_BASE_URL = 'http://localhost:8080/uploads';

export function getProductImageUrl(imageName: string): string {
  if (!imageName) return '';
  if (imageName.startsWith('http')) return imageName;
  return `${IMAGE_BASE_URL}/${imageName}`;
}

// --- PRODUCTS ---
export async function fetchAllProducts(): Promise<ProductDto[]> {

  const response = await axiosInstance.get('/api/v1/products/all');
  return response.data;
}

export async function fetchProductById(id: string | number): Promise<ProductDto> {
  const response = await axiosInstance.get(`/api/v1/products/retrieve/by/id/${id}`);
  return response.data;
}

export async function addProduct(product: Partial<ProductDto>, images?: File[]): Promise<ProductDto> {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  
  if (images && images.length > 0) {
    images.forEach(image => {
      formData.append('images', image);
    });
  }

  const response = await axiosInstance.post('/api/v1/products/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export async function updateProduct(id: string | number, product: Partial<ProductDto>, images?: File[]): Promise<ProductDto> {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  
  if (images && images.length > 0) {
    images.forEach(image => {
      formData.append('images', image);
    });
  }

  const response = await axiosInstance.put(`/api/v1/products/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}


export async function deleteProduct(id: string | number): Promise<void> {
  await axiosInstance.delete(`/api/v1/products/delete/${id}`);
}

export async function deleteProductImage(productId: string | number, imageName: string): Promise<void> {
  await axiosInstance.delete(`/api/v1/products/${productId}/images/${imageName}`);
}

export async function getLowStockProducts(): Promise<ProductDto[]> {
  const response = await axiosInstance.get('/api/v1/products/inventory/low-stock');
  return response.data;
}

export async function getOutOfStockProducts(): Promise<ProductDto[]> {
  const response = await axiosInstance.get('/api/v1/products/inventory/out-of-stock');
  return response.data;
}

export async function checkProductAvailability(id: string | number): Promise<any> {
  const response = await axiosInstance.get(`/api/v1/products/${id}/availability`);
  return response.data;
}

export async function fetchProductsByCategory(category: string): Promise<ProductDto[]> {
  const response = await axiosInstance.get(`/api/v1/products/category/${category}`);
  return response.data;
}

export async function searchProducts(keyword: string): Promise<ProductDto[]> {
  const response = await axiosInstance.get(`/api/v1/products/search?keyword=${keyword}`);
  return response.data;
}

export async function filterProducts(filters: any): Promise<ProductDto[]> {
  const response = await axiosInstance.get('/api/v1/products/filter', { params: filters });
  return response.data;
}

export async function sortProducts(sortBy: string, direction: 'asc' | 'desc'): Promise<ProductDto[]> {
  const response = await axiosInstance.get(`/api/v1/products/sort?by=${sortBy}&dir=${direction}`);
  return response.data;
}

export async function fetchProductsByPage(page: number, size: number): Promise<any> {
  const response = await axiosInstance.get(`/api/v1/products/page/${page}/size/${size}/by`);
  return response.data;
}

// --- ORDERS ---
export async function fetchAllOrders(): Promise<OrderDTO[]> {
  const response = await axiosInstance.get('/api/v1/orders/retrieve/all');
  return response.data;
}

export async function fetchOrderById(id: string | number): Promise<OrderDTO> {
  const response = await axiosInstance.get(`/api/v1/orders/retrieve/by/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: string | number, status: string): Promise<boolean> {
  await axiosInstance.put(`/api/v1/orders/updateStatus/${id}?status=${status}`);
  return true;
}

export async function placeOrder(orderData: OrderDTO): Promise<OrderDTO> {
  const response = await axiosInstance.post('/api/v1/orders/placeOrder', orderData);
  return response.data;
}

export async function searchOrders(type: 'mobile' | 'email' | 'name' | 'orderId', query: string): Promise<OrderDTO[]> {
  const endpoints = {
    mobile: '/api/v1/orders/search/mobile',
    email: '/api/v1/orders/search/email',
    name: '/api/v1/orders/search/customerName',
    orderId: '/api/v1/orders/search/orderId'
  };
  const params: any = {};
  if (type === 'mobile') params.mobileNo = query;
  else if (type === 'email') params.email = query;
  else if (type === 'name') params.customerName = query;
  else if (type === 'orderId') params.orderId = query;
  
  const response = await axiosInstance.get(endpoints[type], { params });
  return response.data;
}

export async function getCustomerOrderHistory(mobileNo: string): Promise<OrderDTO[]> {
  const response = await axiosInstance.get('/api/v1/orders/customer/history', { params: { mobileNo } });
  return response.data;
}

export async function fetchOrdersByDateRange(startDate: string, endDate: string): Promise<OrderDTO[]> {
  const response = await axiosInstance.get(`/api/v1/orders/date-range?start=${startDate}&end=${endDate}`);
  return response.data;
}

export async function deleteOrder(id: string | number): Promise<boolean> {
  await axiosInstance.delete(`/api/v1/orders/${id}`);
  return true;
}

// --- CUSTOMERS ---
export async function fetchAllCustomers(): Promise<CustomerDTO[]> {
  const response = await axiosInstance.get('/api/v1/customers/all');
  return response.data;
}

export async function fetchCustomerById(id: string | number): Promise<CustomerDTO> {
  const response = await axiosInstance.get(`/api/v1/customers/${id}`);
  return response.data;
}

export async function createCustomer(customerData: Partial<CustomerDTO>): Promise<CustomerDTO> {
  const response = await axiosInstance.post('/api/v1/customers/create', customerData);
  return response.data;
}

export async function searchCustomers(keyword: string): Promise<CustomerDTO[]> {
  const response = await axiosInstance.get(`/api/v1/customers/search/keyword?keyword=${keyword}`);
  return response.data;
}

export async function searchCustomersByType(type: 'name' | 'email' | 'mobile', query: string): Promise<CustomerDTO[]> {
  const endpoints = {
    name: '/api/v1/customers/search/name',
    email: '/api/v1/customers/search/email',
    mobile: '/api/v1/customers/search/mobile'
  };
  const params: any = {};
  if (type === 'name') params.name = query;
  else if (type === 'email') params.email = query;
  else if (type === 'mobile') params.mobileNo = query;

  const response = await axiosInstance.get(endpoints[type], { params });
  return response.data;
}


export async function deleteCustomer(id: string | number): Promise<boolean> {
  await axiosInstance.delete(`/api/v1/customers/${id}`);
  return true;
}

// --- ANALYTICS ---
export async function getDashboardAnalytics(): Promise<AnalyticsDTO> {
  const response = await axiosInstance.get('/api/v1/analytics/dashboard');
  return response.data;
}

export async function getTopLevelStats(): Promise<any> {
  const [revenue, inStock, lowStock, activeOrders] = await Promise.all([
    axiosInstance.get('/api/v1/analytics/totalRevenue'),
    axiosInstance.get('/api/v1/analytics/productsInStock'),
    axiosInstance.get('/api/v1/analytics/lowStock'),
    axiosInstance.get('/api/v1/analytics/activeOrders')
  ]);
  
  return {
    revenue: revenue.data,
    inStock: inStock.data,
    lowStock: lowStock.data,
    activeOrders: activeOrders.data
  };
}
