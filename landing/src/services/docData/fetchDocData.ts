import { VersionDocData } from '../../types/docData';
import { DEFAULT_VERSION_DATA } from '../../data/defaults';
import { getStoredMockApiUrl } from '../../config/mockApiConfig';
import { fetchVersionDocRecord } from '../mockapi/versionDocsResource';
import { fetchNavGroupsForVersion } from '../mockapi/navGroupsResource';
import { sanitizeNavGroups } from './sanitizeNavGroups';

export interface FetchDocDataResult {
  data: VersionDocData;
  isFromMockApi: boolean;
  error?: string;
}

function fallbackFor(version: string): VersionDocData {
  const rawData = DEFAULT_VERSION_DATA[version] || DEFAULT_VERSION_DATA['1.0.0'];
  return { ...rawData, navGroups: sanitizeNavGroups(rawData.navGroups) };
}

/**
 * Fetches everything needed to render one version of the docs:
 *  - release meta comes from the main resource (e.g. `releases`)
 *  - nav groups come from the `nav_groups` resource
 *
 * Either resource being missing, empty, or erroring out falls back to the
 * local default dataset for that piece only — so the app keeps working
 * even before both resources have been created on mockapi.io.
 *
 * Env variable docs AND the search index are intentionally NOT MockAPI
 * resources: the free mockapi.io tier caps a project at 2 resources, and
 * both of these describe things that only change alongside the code itself
 * (the package's own .env keys, and the search index over hard-coded page
 * copy) — so they live in `data/defaults/versions/*` instead.
 */
export async function fetchDocDataForVersion(version: string, mockApiUrl?: string): Promise<FetchDocDataResult> {
  const targetUrl = mockApiUrl || getStoredMockApiUrl();

  if (!targetUrl) {
    return { data: fallbackFor(version), isFromMockApi: false };
  }

  const base = DEFAULT_VERSION_DATA[version] || DEFAULT_VERSION_DATA['1.0.0'];

  const [mainResult, navResult] = await Promise.all([
    fetchVersionDocRecord(targetUrl, version),
    fetchNavGroupsForVersion(targetUrl, version),
  ]);

  if (!mainResult.ok) {
    return {
      data: fallbackFor(version),
      isFromMockApi: false,
      error: mainResult.error || 'Failed to connect to MockAPI.',
    };
  }

  const record = mainResult.record;
  let error: string | undefined;

  if (mainResult.empty) {
    error = 'MockAPI resource is currently empty.';
  } else if (!record) {
    error = `No record for version ${version} found in MockAPI. Displaying standard fallback data.`;
  }

  const mergedNavGroups = navResult.items.length > 0 ? navResult.items : base.navGroups;

  const data: VersionDocData = {
    version: record?.version || version,
    releaseName: record?.releaseName || base.releaseName,
    releaseDate: record?.releaseDate || base.releaseDate,
    phpRequirement: record?.phpRequirement || base.phpRequirement,
    laravelRequirement: record?.laravelRequirement || base.laravelRequirement,
    description: record?.description || base.description,
    navGroups: sanitizeNavGroups(mergedNavGroups),
    envVariables: base.envVariables,
    searchResults: base.searchResults,
    features: record?.features || base.features,
    installCommand: record?.installCommand || base.installCommand,
    sampleCode: record?.sampleCode || base.sampleCode,
    githubRepo: record?.githubRepo || base.githubRepo,
    githubStars: typeof record?.githubStars === 'number' ? record.githubStars : base.githubStars,
    isReleased: record?.isReleased !== undefined ? Boolean(record.isReleased) : base.isReleased,
  };

  return { data, isFromMockApi: true, error };
}
