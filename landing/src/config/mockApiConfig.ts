/**
 * Central configuration for talking to a mockapi.io project.
 *
 * IMPORTANT: the URL a person pastes into the MockAPI modal must always be
 * the bare project base — e.g. `https://<id>.mockapi.io/api/v1` — with NO
 * resource name at the end. Every resource URL (main + additional) is built
 * by appending `/<resourceName>` to that base. There is no guessing here on
 * purpose: an earlier version tried to auto-detect whether a pasted URL
 * already pointed at a resource, which silently breaks whenever a mockapi.io
 * project's own path prefix happens to contain a name that looks like a
 * resource (this is exactly what happened when a project's base URL ended
 * in `.../version_docs`, which is just that project's fixed prefix, not a
 * resource — see the chat for the full story).
 *
 * Resources used by this app:
 *   - "main" resource — release metadata (name, dates, requirements,
 *     description, features, install command, sample code, GitHub info).
 *     Configurable via MAIN_RESOURCE_NAME below; rename it in mockApiConfig
 *     if you'd rather call it something else on mockapi.io.
 *   - `nav_groups` — sidebar navigation groups, per version.
 *   Env variable docs and the search index are intentionally NOT MockAPI
 *   resources — see the comments in fetchDocData.ts.
 */

const STORAGE_KEY_MOCKAPI_URL = 'laravel_api_module_mockapi_url';

/** Name of the main (release metadata) resource on mockapi.io. */
export const MAIN_RESOURCE_NAME = 'releases';

/** Names of the additional resources this app creates data in. */
export const MOCKAPI_RESOURCE_NAMES = {
  navGroups: 'nav_groups',
} as const;

export function getStoredMockApiUrl(): string {
  return localStorage.getItem(STORAGE_KEY_MOCKAPI_URL) || '';
}

export function setStoredMockApiUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY_MOCKAPI_URL, url.trim());
}

/** Builds the URL for the main (release metadata) resource. */
export function formatMockApiResourceUrl(baseUrl: string): string {
  const cleaned = baseUrl.trim().replace(/\/+$/, '');
  return cleaned ? `${cleaned}/${MAIN_RESOURCE_NAME}` : '';
}

/** Builds the full URL for one of the additional (non-main) resources. */
export function buildResourceUrl(baseUrl: string, resourceName: string): string {
  const cleaned = baseUrl.trim().replace(/\/+$/, '');
  return cleaned ? `${cleaned}/${resourceName}` : '';
}
