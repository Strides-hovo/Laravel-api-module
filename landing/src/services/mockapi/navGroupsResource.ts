/**
 * `nav_groups` resource — one record per sidebar group per version.
 * Additional resource (not the pre-existing main one).
 *
 * Record shape on MockAPI:
 * { id, version, groupId, label, icon, order, items: [{ id, label, badge? }] }
 */
import { NavGroup } from '../../types';
import { MOCKAPI_RESOURCE_NAMES, buildResourceUrl } from '../../config/mockApiConfig';
import { mockApiCreate, mockApiGetAll } from './client';

export interface NavGroupRecord extends NavGroup {
  version: string;
  order?: number;
}

const RESOURCE_NAME = MOCKAPI_RESOURCE_NAMES.navGroups;

export async function fetchNavGroupsForVersion(
  baseUrl: string,
  version: string
): Promise<{ items: NavGroupRecord[]; ok: boolean; error?: string }> {
  const url = buildResourceUrl(baseUrl, RESOURCE_NAME);
  if (!url) return { items: [], ok: false };

  const result = await mockApiGetAll<NavGroupRecord>(url);
  if (!result.ok) return { items: [], ok: false, error: result.error };

  const items = result.items
    .filter((item) => item.version === version)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return { items, ok: true };
}

/** Creates one record per group for a version. Used only during seeding. */
export async function seedNavGroupsForVersion(
  baseUrl: string,
  version: string,
  groups: NavGroup[]
): Promise<number> {
  const url = buildResourceUrl(baseUrl, RESOURCE_NAME);
  if (!url) return 0;

  let createdCount = 0;
  for (let index = 0; index < groups.length; index++) {
    const payload: NavGroupRecord = { ...groups[index], version, order: index };
    const result = await mockApiCreate<NavGroupRecord>(url, payload);
    if (result.ok) createdCount++;
  }
  return createdCount;
}
