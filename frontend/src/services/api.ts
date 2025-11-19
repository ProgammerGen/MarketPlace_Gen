import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  AuthResponse,
  ApiResponse,
  ProductsResponse,
  ProductResponse,
  User,
  Order,
  Category,
  ProductsQueryParams,
} from '../types';

const API_URL = 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred. Please try again.';

        const customError = new Error(errorMessage);
        (customError as any).response = error.response;
        (customError as any).status = error.response?.status;

        return Promise.reject(customError);
      }
    );
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    address?: string
  ): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getProducts(params?: ProductsQueryParams): Promise<ApiResponse<ProductsResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = `/products${queryString ? `?${queryString}` : ''}`;
    const response = await this.api.get<ApiResponse<ProductsResponse>>(url);
    return response.data;
  }

  async getProduct(id: string): Promise<ApiResponse<ProductResponse>> {
    const response = await this.api.get<ApiResponse<ProductResponse>>(`/products/${id}`);
    return response.data;
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await this.api.get<ApiResponse<Order[]>>('/orders');
    return response.data;
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const response = await this.api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(
    items: Array<{ productId: string; quantity: number }>,
    shippingAddress?: string,
    paymentMethod?: string
  ): Promise<ApiResponse<Order>> {
    const response = await this.api.post<ApiResponse<Order>>('/orders', {
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'credit_card',
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

