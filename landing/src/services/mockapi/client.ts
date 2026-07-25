/**
 * Small, generic REST helpers shared by every MockAPI resource module.
 * Nothing in here knows about "nav groups" or "version docs" — that lives
 * in the per-resource files next to this one.
 */

export interface MockApiListResult<T> {
  ok: boolean;
  items: T[];
  error?: string;
}

export interface MockApiWriteResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function mockApiGetAll<T>(resourceUrl: string): Promise<MockApiListResult<T>> {
  try {
    const res = await fetch(resourceUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      // A 404 usually just means the resource hasn't been created yet.
      return { ok: false, items: [], error: `MockAPI HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    return { ok: true, items: Array.isArray(data) ? data : [] };
  } catch (err: any) {
    return { ok: false, items: [], error: err?.message || 'Failed to connect to MockAPI.' };
  }
}

export async function mockApiCreate<T>(resourceUrl: string, payload: unknown): Promise<MockApiWriteResult<T>> {
  try {
    const res = await fetch(resourceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, error: `MockAPI HTTP POST error ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to create record on MockAPI.' };
  }
}

export async function mockApiUpdate<T>(
  resourceUrl: string,
  id: string,
  payload: unknown
): Promise<MockApiWriteResult<T>> {
  try {
    const res = await fetch(`${resourceUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, error: `MockAPI HTTP PUT error ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to update record on MockAPI.' };
  }
}
