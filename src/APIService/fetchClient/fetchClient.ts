import { notifications } from '@mantine/notifications';

export class HttpError extends Error {
  constructor(public response: Response, message?: string) {
    super(message);
  }
}

//TODO: This is a temporary type
type DataResponse<T> =
  | { data: T }
  | { message: string }
  | { error: { message: string } };

async function handleResponse<T>(response: Response): Promise<DataResponse<T>> {
  if (!response.ok) {
    const data = await response.json();
    notifications.show({
      title: 'Error.',
      message:
        data.message ||
        data.error.message ||
        'API Call Error occurred. Please try again',
      color: 'red',
    });
    return data;
  }
  return await response.json();

  // if (!response.ok) {
  //   // if (response.status === 401) {
  //   //   //TODO: Add a logout function here and a snackbar to show the user they have been logged out
  //   //   window.location.href = '/login';
  //   // }
  //   //TODO:  show the user the error message
  //   const data = await response.json();
  //   notifications.show({
  //     title: 'Error.',
  //     message: data.message || 'API Call Error occurred. Please try again',
  //     color: 'red',
  //   });
  //   // throw new HttpError(response);
  //   console.error('API Call Error occurred. Please try again');
  // }

  // return await response.json();
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
