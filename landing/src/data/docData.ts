/**
 * Barrel module kept for backward compatibility with existing imports
 * (`from '../data/docData'`). The actual data now lives under
 * `data/defaults/versions/*` (split per released version) and
 * `data/codegen/moduleTemplates.ts` (the PHP file generator).
 *
 * These three exports mirror the v1.0.0 defaults, matching the original
 * behavior of this file before the refactor.
 */
export { NAV_GROUPS_V1_0_0 as NAV_GROUPS } from './defaults';
export { ENV_VARIABLES_V1_0_0 as INITIAL_ENV_VARIABLES } from './defaults';
export { SEARCH_ITEMS_V1_0_0 as SEARCH_ITEMS } from './defaults';

export { generateModuleFiles } from './codegen/moduleTemplates';
