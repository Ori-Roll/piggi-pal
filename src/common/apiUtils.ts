import { RouteFunction } from '@/types/apiTypes';
import { HttpStatusCodesValues } from './HttpStatusCodes';
import { NextApiRequest, NextApiResponse } from 'next';

type ErrorDetails = {
  fieldId: string;
  reason?: string;
};

export class APIError extends Error {
  // Including the 'details' field as optional for flexibility
  constructor(
    public statusCode: HttpStatusCodesValues,
    public message: string,
    public code?: string,
    public details?: ErrorDetails[] // Optional details to include
  ) {
    super(message);
    this.name = this.constructor.name; // Set the name to "APIError" for clarity
  }
}

type ErrorResponseBody = {
  error: {
    message: string;
    code?: string;
    details?: ErrorDetails[];
  };
};

type Function<T> =
  | ((req: NextApiRequest, res: NextApiResponse) => Promise<void>)
  | RouteFunction<T>;

export const apiErrorMiddleware = <T>(handler: Function<T>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Call the handler for the API route
      await handler(req, res);
    } catch (error) {
      if (error instanceof APIError) {
        return res.status(error.statusCode).json({
          error: {
            message: error.message,
            ...(error.code ? { code: error.code } : {}),
            ...(error.details ? { details: error.details } : {}),
          },
        });
      }

      // Generic error handling
      return res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred.',
        },
      });
    }
  };
};
