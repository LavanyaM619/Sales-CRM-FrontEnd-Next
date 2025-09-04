import axios from 'axios';
import Cookies from 'js-cookie';
import { User, Category, Order, AuthResponse, ApiResponse, OrderFilters } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  seedAdmin: async (): Promise<{ ok: boolean }> => {
    const response = await api.post('/auth/seed-admin');
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/auth/users');
    return response.data;
  },
};

// Category API
export const categoryAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (categoryData: {
    name: string;
    description?: string;
  }): Promise<Category> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  update: async (id: string, categoryData: {
    name?: string;
    description?: string;
  }): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  delete: async (id: string): Promise<{ ok: boolean }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const orderAPI = {
  getAll: async (filters?: OrderFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  update: async (id: string, orderData: any) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  markViewed: async (id: string) => {
    const response = await api.patch(`/orders/${id}/viewed`);
    return response.data;
  },

  exportCsv: async (filters?: OrderFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/orders/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data instanceof Blob ? response.data : new Blob([response.data]);
  },
};




export default api;
