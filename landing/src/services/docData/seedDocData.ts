import { DEFAULT_VERSION_DATA, SUPPORTED_VERSIONS } from '../../data/defaults';
import { MAIN_RESOURCE_NAME, MOCKAPI_RESOURCE_NAMES } from '../../config/mockApiConfig';
import { createVersionDocRecord, fetchAllVersionDocRecords } from '../mockapi/versionDocsResource';
import { seedNavGroupsForVersion, fetchNavGroupsForVersion } from '../mockapi/navGroupsResource';

export interface SeedResult {
  success: boolean;
  message: string;
  seededCount: number;
}

/**
 * Seeds the MockAPI project with the default v1.0.0 / v1.5.0 / v2.0.0 dataset.
 *
 * - The main resource (`releases` by default) gets one record per version,
 *   skipped if a version already exists.
 * - `nav_groups` gets one record per nav group per version, same rule.
 *
 * Env variable docs and the search index are not MockAPI resources — see
 * the comment in fetchDocData.ts — so there's nothing to seed for them.
 */
export async function seedMockApiData(mockApiUrl: string): Promise<SeedResult> {
  try {
    const existingMain = await fetchAllVersionDocRecords(mockApiUrl);
    if (!existingMain.ok) {
      throw new Error(existingMain.error || 'MockAPI connection test failed.');
    }

    let seededCount = 0;
    const versions = SUPPORTED_VERSIONS.map((v) => v.value);

    for (const version of versions) {
      const versionData = DEFAULT_VERSION_DATA[version];

      // 1. Main resource — one record per version.
      const alreadyHasMainRecord = existingMain.items.some(
        (item) => item.version === version || item.version === `v${version}`
      );
      if (!alreadyHasMainRecord) {
        const created = await createVersionDocRecord(mockApiUrl, versionData);
        if (created) seededCount++;
      }

      // 2. nav_groups — only seed a version if it has no records yet there.
      const navExisting = await fetchNavGroupsForVersion(mockApiUrl, version);
      if (navExisting.items.length === 0) {
        seededCount += await seedNavGroupsForVersion(mockApiUrl, version, versionData.navGroups);
      }
    }

    return {
      success: true,
      message:
        seededCount > 0
          ? `Successfully created ${seededCount} record(s) across the "${MAIN_RESOURCE_NAME}" and "${MOCKAPI_RESOURCE_NAMES.navGroups}" resources!`
          : `MockAPI already contains records for all supported versions (${existingMain.items.length} main record(s) found).`,
      seededCount,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Error seeding MockAPI resources.',
      seededCount: 0,
    };
  }
}
