/**
 * Barrel module kept for backward compatibility with existing imports
 * (`from '../services/api'`). The real implementation now lives in small,
 * focused modules:
 *
 *   config/mockApiConfig.ts       — URL storage & resolution helpers
 *   services/mockapi/*Resource.ts — one file per MockAPI resource
 *   services/docData/*.ts         — fetch / save / seed orchestration
 *   services/github/*.ts          — GitHub stars lookup
 *   data/defaults/*               — local fallback dataset, split by version
 */
export type { VersionDocData } from '../types/docData';

export { SUPPORTED_VERSIONS, DEFAULT_VERSION_DATA } from '../data/defaults';

export {
  getStoredMockApiUrl,
  setStoredMockApiUrl,
  formatMockApiResourceUrl,
} from '../config/mockApiConfig';

export { fetchDocDataForVersion } from './docData/fetchDocData';
export { saveDocDataForVersion } from './docData/saveDocData';
export { seedMockApiData } from './docData/seedDocData';

export { fetchGitHubStars } from './github/fetchGitHubStars';
