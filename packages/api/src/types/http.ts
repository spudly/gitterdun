import type express from 'express';
import type {ParsedQs} from 'qs';
// Intentionally avoid specifying default type parameters unless necessary

export type RequestWithBody<
  B,
  P = Record<string, string>,
  Q = ParsedQs,
> = express.Request<P, unknown, B, Q>;

export type RequestWithParams<
  P extends Record<string, string>,
  Q = ParsedQs,
> = express.Request<P, unknown, unknown, Q>;

export type RequestWithParamsAndBody<
  P extends Record<string, string>,
  B,
  Q = ParsedQs,
> = express.Request<P, unknown, B, Q>;

export type RequestWithQuery<
  Q extends ParsedQs,
  P = Record<string, string>,
> = express.Request<P, unknown, unknown, Q>;

export type RequestDefault = express.Request<
  Record<string, string>,
  unknown,
  unknown
>;

export type TypedResponse<T = unknown> = express.Response<
  {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  },
  Record<string, unknown>
>;
