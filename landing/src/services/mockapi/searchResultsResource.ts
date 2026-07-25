/**
 * `search_results` resource — one record per search-index entry per version.
 * Additional resource (not the pre-existing main one).
 *
 * Record shape on MockAPI:
 * { id, version, order, pageId, title, category, description, codeSnippet? }
 */
import { SearchResult } from '../../types';
import { MOCKAPI_RESOURCE_NAMES, buildResourceUrl } from '../../config/mockApiConfig';
import { mockApiCreate, mockApiGetAll } from './client';

export interface SearchResultRecord extends SearchResult {
  version: string;
  order?: number;
}

const RESOURCE_NAME = MOCKAPI_RESOURCE_NAMES.searchResults;

export async function fetchSearchResultsForVersion(
  baseUrl: string,
  version: string
): Promise<{ items: SearchResultRecord[]; ok: boolean; error?: string }> {
  const url = buildResourceUrl(baseUrl, RESOURCE_NAME);
  if (!url) return { items: [], ok: false };

  const result = await mockApiGetAll<SearchResultRecord>(url);
  if (!result.ok) return { items: [], ok: false, error: result.error };

  const items = result.items
    .filter((item) => item.version === version)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return { items, ok: true };
}

/** Creates one record per search entry for a version. Used only during seeding. */
export async function seedSearchResultsForVersion(
  baseUrl: string,
  version: string,
  entries: SearchResult[]
): Promise<number> {
  const url = buildResourceUrl(baseUrl, RESOURCE_NAME);
  if (!url) return 0;

  let createdCount = 0;
  for (let index = 0; index < entries.length; index++) {
    const payload: SearchResultRecord = { ...entries[index], version, order: index };
    const result = await mockApiCreate<SearchResultRecord>(url, payload);
    if (result.ok) createdCount++;
  }
  return createdCount;
}
