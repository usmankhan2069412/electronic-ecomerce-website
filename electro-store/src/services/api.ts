import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // Use relative URL instead of absolute URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Product API
export const productApi = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

// Admin API
export const adminApi = {
  // Get all products (admin view)
  getAllProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data;
  },

  // Create a new product
  createProduct: async (productData: any) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  // Update an existing product
  updateProduct: async (productId: string, productData: any) => {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  },

  // Delete a product
  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  // Get all categories (admin view)
  getAllCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  // Create a new category
  createCategory: async (categoryData: any) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  // Update an existing category
  updateCategory: async (categoryId: string, categoryData: any) => {
    const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Delete a category
  deleteCategory: async (categoryId: string) => {
    const response = await api.delete(`/admin/categories/${categoryId}`);
    return response.data;
  },
};

export default api;