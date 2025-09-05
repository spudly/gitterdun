// Core API HTTP methods
import {z} from 'zod';
import type {ApiResponse} from './apiUtils';
import {API_BASE_URL, handleResponseWithSchema} from './apiUtils';

export const buildUrlWithParams = (
  endpoint: string,
  params?: Record<string, unknown>,
): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        if (
          typeof value === 'string'
          || typeof value === 'number'
          || typeof value === 'boolean'
        ) {
          url.searchParams.append(key, String(value));
        } else {
          url.searchParams.append(key, JSON.stringify(value));
        }
      }
    });
  }
  return url.toString();
};

export const api = {
  // GET request
  async get<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrlWithParams(endpoint, params), {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // POST request
  async post<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data === undefined ? null : JSON.stringify(data),
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // PUT request
  async put<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data === undefined ? null : JSON.stringify(data),
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // DELETE request
  async delete<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },

  // PATCH request
  async patch<T>(
    endpoint: string,
    dataSchema: z.ZodType<T>,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: data === undefined ? null : JSON.stringify(data),
    });

    return handleResponseWithSchema<T>(response, dataSchema);
  },
};
