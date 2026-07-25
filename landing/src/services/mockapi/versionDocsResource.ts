/**
 * The main resource — release metadata (name, dates, requirements,
 * description, features, install command, sample code, GitHub info).
 * Its name on mockapi.io is controlled by MAIN_RESOURCE_NAME in
 * `config/mockApiConfig.ts` (default: `releases`).
 */
import { VersionDocData } from '../../types/docData';
import { formatMockApiResourceUrl } from '../../config/mockApiConfig';
import { mockApiCreate, mockApiGetAll, mockApiUpdate } from './client';

export interface VersionDocsRawRecord extends Partial<VersionDocData> {
  id?: string;
  version?: string;
}

function findRecordForVersion(items: VersionDocsRawRecord[], version: string) {
  return items.find(
    (item) => item.version === version || item.version === `v${version}` || item.version?.startsWith(version)
  );
}

/** Reads every record from the main resource and returns the one matching `version`, if any. */
export async function fetchVersionDocRecord(
  baseUrl: string,
  version: string
): Promise<{ record: VersionDocsRawRecord | undefined; ok: boolean; empty: boolean; error?: string }> {
  const url = formatMockApiResourceUrl(baseUrl);
  const result = await mockApiGetAll<VersionDocsRawRecord>(url);

  if (!result.ok) {
    return { record: undefined, ok: false, empty: false, error: result.error };
  }

  return {
    record: findRecordForVersion(result.items, version),
    ok: true,
    empty: result.items.length === 0,
  };
}

/** Creates the main resource record for a version. Used only during seeding. */
export async function createVersionDocRecord(baseUrl: string, payload: VersionDocData): Promise<boolean> {
  const url = formatMockApiResourceUrl(baseUrl);
  const result = await mockApiCreate<VersionDocsRawRecord>(url, payload);
  return result.ok;
}

/** Updates an existing main-resource record by id. */
export async function updateVersionDocRecord(
  baseUrl: string,
  recordId: string,
  payload: VersionDocData
): Promise<{ ok: boolean; data?: VersionDocsRawRecord; error?: string }> {
  const url = formatMockApiResourceUrl(baseUrl);
  const result = await mockApiUpdate<VersionDocsRawRecord>(url, recordId, payload);
  return result;
}

/** Creates a brand-new main-resource record (no existing id to update). */
export async function insertVersionDocRecord(
  baseUrl: string,
  payload: VersionDocData
): Promise<{ ok: boolean; data?: VersionDocsRawRecord; error?: string }> {
  const url = formatMockApiResourceUrl(baseUrl);
  const result = await mockApiCreate<VersionDocsRawRecord>(url, payload);
  return result;
}

/** Fetches every existing record, used by the seed routine to avoid duplicates. */
export async function fetchAllVersionDocRecords(
  baseUrl: string
): Promise<{ items: VersionDocsRawRecord[]; ok: boolean; error?: string }> {
  const url = formatMockApiResourceUrl(baseUrl);
  const result = await mockApiGetAll<VersionDocsRawRecord>(url);
  return { items: result.items, ok: result.ok, error: result.error };
}
