import axiosInstance from './axios-instance';

// --- PRODUCTS ---
export async function fetchAllProducts() {
  const response = await axiosInstance.get('/products/all');
  return response.data;
}

export async function fetchProductById(id: string | number) {
  const response = await axiosInstance.get(`/products/retrieve/by/id/${id}`);
  return response.data;
}

export async function addProduct(product: any) {
  const response = await axiosInstance.post('/products/add', product);
  return response.data;
}

export async function updateProduct(id: string | number, product: any) {
  const response = await axiosInstance.put(`/products/update/${id}`, product);
  return response.data;
}

export async function deleteProduct(id: string | number) {
  await axiosInstance.delete(`/products/delete/${id}`);
  return true;
}

export async function getLowStockProducts() {
  const response = await axiosInstance.get('/products/inventory/low-stock');
  return response.data;
}

export async function checkProductAvailability(id: string | number) {
  const response = await axiosInstance.get(`/products/${id}/availability`);
  return response.data;
}

// --- ORDERS ---
export async function fetchAllOrders() {
  const response = await axiosInstance.get('/orders/retrieve/all');
  return response.data;
}

export async function fetchOrderById(id: string | number) {
  const response = await axiosInstance.get(`/orders/retrieve/by/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: string | number, status: string) {
  await axiosInstance.put(`/orders/updateStatus/${id}?status=${status}`);
  return true;
}

