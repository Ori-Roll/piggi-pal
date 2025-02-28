import { NextApiRequest, NextApiResponse } from 'next';

type ResponseFormat<T> =
  | {
      data: T | T[];
    }
  | { message: string };

export type RouteFunction<T> = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseFormat<T>>
) => void;
