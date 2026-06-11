import { config } from '../config';
import type { ApiErrorBody } from '../types';
import { ApiError } from '../types';

function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined | null | string[]>,
): string {
  const base = config.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item) url.searchParams.append(key, item);
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & {
    params?: Record<string, string | number | undefined | null | string[]>;
  } = {},
): Promise<T> {
  const { params, ...init } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = await parseJson<ApiErrorBody>(response);
    } catch {
      body = undefined;
    }
    throw new ApiError(body?.error ?? response.statusText, response.status, body);
  }

  if (response.status === 204) return {} as T;
  return parseJson<T>(response);
}

export function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

export function toIsoDate(date: Date): string {
  return date.toISOString();
}

export function defaultPeriod(): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  return { start: toIsoDate(start), end: toIsoDate(end) };
}
