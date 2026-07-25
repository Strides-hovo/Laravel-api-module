/**
 * `env_variables` resource — one record per documented .env key per version.
 * Additional resource (not the pre-existing main one).
 *
 * Record shape on MockAPI:
 * { id, version, order, key, value, defaultValue, description, type }
 */
import { EnvVariable } from '../../types';
import { MOCKAPI_RESOURCE_NAMES, buildResourceUrl } from '../../config/mockApiConfig';
import { mockApiCreate, mockApiGetAll } from './client';

export interface EnvVariableRecord extends EnvVariable {
  id?: string;
  version: string;
  order?: number;
}

const RESOURCE_NAME = MOCKAPI_RESOURCE_NAMES.envVariables;

export async function fetchEnvVariablesForVersion(
  baseUrl: string,
  version: string
): Promise<{ items: EnvVariableRecord[]; ok: boolean; error?: string }> {
  const url = buildResourceUrl(baseUrl, RESOURCE_NAME);
  if (!url) return { items: [], ok: false };

  const result = await mockApiGetAll<EnvVariableRecord>(url);
  if (!result.ok) return { items: [], ok: false, error: result.error };

  const items = result.items
    .filter((item) => item.version === version)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return { items, ok: true };
}

/** Creates one record per env variable for a version. Used only during seeding. */
export async function seedEnvVariablesForVersion(
  baseUrl: string,
  version: string,
  variables: EnvVariable[]
): Promise<number> {
  const url = buildResourceUrl(baseUrl, RESOURCE_NAME);
  if (!url) return 0;

  let createdCount = 0;
  for (let index = 0; index < variables.length; index++) {
    const payload: EnvVariableRecord = { ...variables[index], version, order: index };
    const result = await mockApiCreate<EnvVariableRecord>(url, payload);
    if (result.ok) createdCount++;
  }
  return createdCount;
}
