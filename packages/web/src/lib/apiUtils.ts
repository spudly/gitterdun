// Core API utilities and types
import {z} from 'zod';
import {apiResponseSchema as createApiResponseSchema} from '@gitterdun/shared';

const API_ORIGIN = !__PROD__ || __TEST__ ? 'http://localhost:8000' : '';
export const API_BASE_URL = `${API_ORIGIN}/api`;

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T | undefined;
  error?: string | undefined;
  message?: string | undefined;
  details?: unknown;
  pagination?: {page: number; limit: number; total: number; totalPages: number};
};

export class ApiError extends Error {
  public status: number;
  public details?: unknown;
  public constructor(status: number, details?: unknown) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const handleErrorResponse = async (response: Response): Promise<never> => {
  const errorData: unknown = await response.json().catch(() => ({}) as unknown);
  throw new ApiError(response.status, errorData);
};

const parseResponseData = async (response: Response): Promise<unknown> => {
  return (await response.json()) as unknown;
};

const tryPrimaryParsing = <TData>(
  raw: unknown,
  dataSchema: z.ZodType<TData>,
): ApiResponse<TData> | null => {
  const parsed = createApiResponseSchema(dataSchema).safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }
  return null;
};

const createFallbackSchema = () => {
  return z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });
};

const addOptionalMeta = <T extends Record<string, unknown>>(
  base: T,
  error?: string,
  message?: string,
): T & {error?: string; message?: string} => {
  return {
    ...base,
    ...(error === undefined ? {} : {error}),
    ...(message === undefined ? {} : {message}),
  };
};

const handleFallbackParsing = <TData>(
  raw: unknown,
  dataSchema: z.ZodType<TData>,
): ApiResponse<TData> | null => {
  const fallback = createFallbackSchema().safeParse(raw);
  if (fallback.success && fallback.data.success) {
    const dataParsed = dataSchema.safeParse(fallback.data.data);
    if (dataParsed.success) {
      const base: ApiResponse<TData> = {success: true, data: dataParsed.data};
      return addOptionalMeta(base, fallback.data.error, fallback.data.message);
    }
    const res: ApiResponse<TData> = {success: true} as ApiResponse<TData>;
    return addOptionalMeta(res, fallback.data.error, fallback.data.message);
  }
  return null;
};

const processResponseData = async <TData>(
  response: Response,
  dataSchema: z.ZodType<TData>,
): Promise<ApiResponse<TData>> => {
  const raw = await parseResponseData(response);
  const primaryResult = tryPrimaryParsing(raw, dataSchema);
  if (primaryResult) {
    return primaryResult;
  }

  const fallbackResult = handleFallbackParsing(raw, dataSchema);
  if (fallbackResult) {
    return fallbackResult;
  }

  const parsed = createApiResponseSchema(dataSchema).safeParse(raw);
  throw new Error(`Response validation failed: ${parsed.error?.message}`);
};

export const handleResponseWithSchema = async <TData>(
  response: Response,
  dataSchema: z.ZodType<TData>,
): Promise<ApiResponse<TData>> => {
  if (!response.ok) {
    return handleErrorResponse(response);
  }

  return processResponseData(response, dataSchema);
};
