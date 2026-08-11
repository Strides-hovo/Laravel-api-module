/**
 * Local fallback dataset, used when no MockAPI project is configured yet
 * (or when a MockAPI request fails / a resource is still empty).
 *
 * Each version's data now lives in its own file under `./versions`,
 * split into nav groups / env variables / search items / release meta —
 * mirroring the four MockAPI resources this app reads from.
 */
import { VersionDocData } from '../../types/docData';
import { NAV_GROUPS_V1_0_0, ENV_VARIABLES_V1_0_0, SEARCH_ITEMS_V1_0_0, META_V1_0_0 } from './versions/v1_0_0';
import { NAV_GROUPS_V2_0_0, ENV_VARIABLES_V2_0_0, SEARCH_ITEMS_V2_0_0, META_V2_0_0 } from './versions/v2_0_0';

export const SUPPORTED_VERSIONS = [
  { value: '2.0.0', label: 'Version 2.0.0 (Current)', tag: 'Stable' },
  { value: '1.0.0', label: 'Version 1.0.0 (Legacy)', tag: 'Legacy' },
];

export const DEFAULT_VERSION_DATA: Record<string, VersionDocData> = {
  '1.0.0': {
    ...META_V1_0_0,
    navGroups: NAV_GROUPS_V1_0_0,
    envVariables: ENV_VARIABLES_V1_0_0,
    searchResults: SEARCH_ITEMS_V1_0_0,
  },
  '2.0.0': {
    ...META_V2_0_0,
    navGroups: NAV_GROUPS_V2_0_0,
    envVariables: ENV_VARIABLES_V2_0_0,
    searchResults: SEARCH_ITEMS_V2_0_0,
  },
};

/** Re-exported for the barrel modules that still expect the old flat names (v1.0.0 shape). */
export { NAV_GROUPS_V1_0_0, ENV_VARIABLES_V1_0_0, SEARCH_ITEMS_V1_0_0 };
