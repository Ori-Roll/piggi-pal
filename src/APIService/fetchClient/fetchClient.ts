import { notifications } from '@mantine/notifications';

export class HttpError extends Error {
  constructor(public response: Response, message?: string) {
    super(message);
  }
}

type DataResponse<T> = { data: T };

async function handleResponse<T>(response: Response): Promise<DataResponse<T>> {
  if (!response.ok) {
    // if (response.status === 401) {
    //   //TODO: Add a logout function here and a snackbar to show the user they have been logged out
    //   window.location.href = '/login';
    // }
    //TODO:  show the user the error message
    notifications.show({
      title: 'API Call Error.',
      message: 'API Call Error occurred. Please try again',
      color: 'red',
    });
    // throw new HttpError(response);
  }

  return await response.json();
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Cross-origin-Opener-Policy': 'same-origin',
};

const API_BASE_URL = 'api';

export const client = {
  get: async <T>(endpoint: string): Promise<DataResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        ...defaultHeaders,
      },
    });
    return await handleResponse<T>(response);
  },

  post: async <T>(
    endpoint: string,
    data?: unknown
  ): Promise<DataResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...defaultHeaders,
      },
      body: data
        ? JSON.stringify(data, (_, value) => {
            if (!isNaN(value)) value = Number(value);
            return value;
          })
        : undefined,
    });
    return await handleResponse<T>(response);
  },

  patch: async <T>(
    endpoint: string,
    data: unknown
  ): Promise<DataResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<DataResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...defaultHeaders,
      },
    });
    return await handleResponse<T>(response);
  },
};
