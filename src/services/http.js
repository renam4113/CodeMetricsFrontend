import { API_BASE } from '@/constants';

/**
 * @template T
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function request(path, options = {}) {
    const url = `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json') || contentType.includes('text/json')) {
        return response.json();
    }

    const text = await response.text();
    if (!text) return /** @type {T} */ (null);
    try {
        return JSON.parse(text);
    } catch {
        return /** @type {T} */ (text);
    }
}

/**
 * @param {Record<string, unknown>} params
 */
export function toQuery(params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
            value.forEach((item) => search.append(key, String(item)));
        } else if (value instanceof Date) {
            search.append(key, value.toISOString());
        } else {
            search.append(key, String(value));
        }
    });
    const query = search.toString();
    return query ? `?${query}` : '';
}
