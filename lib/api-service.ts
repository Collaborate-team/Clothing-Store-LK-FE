const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// --- PRODUCTS ---
export async function fetchAllProducts() {
  const response = await fetch(`${BASE_URL}/products/all`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function fetchProductById(id: string | number) {
  const response = await fetch(`${BASE_URL}/products/retrieve/by/id/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
}

export async function addProduct(product: any) {
  const response = await fetch(`${BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error('Failed to add product');
  return response.json();
}

export async function updateProduct(id: string | number, product: any) {
  const response = await fetch(`${BASE_URL}/products/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(id: string | number) {
  const response = await fetch(`${BASE_URL}/products/delete/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return true;
}

export async function getLowStockProducts() {
  const response = await fetch(`${BASE_URL}/products/inventory/low-stock`);
  if (!response.ok) throw new Error('Failed to fetch low stock products');
  return response.json();
}

export async function checkProductAvailability(id: string | number) {
  const response = await fetch(`${BASE_URL}/products/${id}/availability`);
  if (!response.ok) throw new Error('Failed to check availability');
  return response.json();
}

// --- ORDERS ---
export async function fetchAllOrders() {
  const response = await fetch(`${BASE_URL}/orders/retrieve/all`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
}

export async function fetchOrderById(id: string | number) {
  const response = await fetch(`${BASE_URL}/orders/retrieve/by/${id}`);
  if (!response.ok) throw new Error('Failed to fetch order details');
  return response.json();
}

export async function updateOrderStatus(id: string | number, status: string) {
  const response = await fetch(`${BASE_URL}/orders/updateStatus/${id}?status=${status}`, {
    method: 'PUT'
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return true;
}
