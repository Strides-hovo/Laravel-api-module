import { VersionDocData } from '../../types/docData';
import { DEFAULT_VERSION_DATA, NAV_GROUPS_V1_0_0, ENV_VARIABLES_V1_0_0, SEARCH_ITEMS_V1_0_0 } from '../../data/defaults';
import { getStoredMockApiUrl } from '../../config/mockApiConfig';
import { fetchAllVersionDocRecords, insertVersionDocRecord, updateVersionDocRecord } from '../mockapi/versionDocsResource';

export interface SaveDocDataResult {
  success: boolean;
  message: string;
  updatedData?: VersionDocData;
}

function withLocalDefaults(version: string): VersionDocData {
  return {
    version,
    releaseName: `Release v${version}`,
    releaseDate: new Date().toISOString().split('T')[0],
    phpRequirement: '8.2+',
    laravelRequirement: '11.x',
    description: '',
    navGroups: NAV_GROUPS_V1_0_0,
    envVariables: ENV_VARIABLES_V1_0_0,
    searchResults: SEARCH_ITEMS_V1_0_0,
    features: [],
    installCommand: `composer require strides/laravel-api-module:^${version}`,
    sampleCode: '',
  };
}

/**
 * Saves the admin-editable release meta fields (name, dates, requirements,
 * description, features, install command, sample code, GitHub info) to the
 * main MockAPI resource. The admin editor never touches nav groups / env
 * variables / search results, so this function doesn't need to either.
 */
export async function saveDocDataForVersion(
  version: string,
  updatedData: Partial<VersionDocData>,
  mockApiUrl?: string
): Promise<SaveDocDataResult> {
  const targetUrl = mockApiUrl || getStoredMockApiUrl();

  // Keep the local in-memory fallback in sync so the UI reflects changes instantly.
  DEFAULT_VERSION_DATA[version] = {
    ...(DEFAULT_VERSION_DATA[version] || withLocalDefaults(version)),
    ...updatedData,
  };

  if (!targetUrl) {
    return {
      success: true,
      message: `Saved updates for version ${version} to local memory! Connect a MockAPI URL to sync with the remote server.`,
      updatedData: DEFAULT_VERSION_DATA[version],
    };
  }

  const existing = await fetchAllVersionDocRecords(targetUrl);
  const match = existing.items.find(
    (item) => item.version === version || item.version === `v${version}` || item.version?.startsWith(version)
  );

  const fullPayload: VersionDocData = {
    ...DEFAULT_VERSION_DATA[version],
    ...updatedData,
    version,
  };

  try {
    if (match?.id) {
      const result = await updateVersionDocRecord(targetUrl, match.id, fullPayload);
      if (!result.ok) throw new Error(result.error || 'MockAPI PUT failed.');

      return {
        success: true,
        message: `Successfully synced version ${version} changes to MockAPI (Record ID #${match.id})!`,
        updatedData: result.data as VersionDocData,
      };
    }

    const result = await insertVersionDocRecord(targetUrl, fullPayload);
    if (!result.ok) throw new Error(result.error || 'MockAPI POST failed.');

    return {
      success: true,
      message: `Successfully created new record for version ${version} on MockAPI!`,
      updatedData: result.data as VersionDocData,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to save to MockAPI. Changes applied to local state.',
      updatedData: DEFAULT_VERSION_DATA[version],
    };
  }
}
