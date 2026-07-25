import { NavGroup, SearchResult, EnvVariable } from '../types';

/**
 * Full documentation payload for one released version of the package.
 * Assembled at runtime from the main MockAPI resource (meta fields) plus
 * the three additional resources (navGroups / envVariables / searchResults),
 * or from the local fallback defaults when no MockAPI project is configured.
 */
export interface VersionDocData {
  id?: string;
  version: string;
  releaseName: string;
  releaseDate: string;
  phpRequirement: string;
  laravelRequirement: string;
  description: string;
  navGroups: NavGroup[];
  envVariables: EnvVariable[];
  searchResults: SearchResult[];
  features: string[];
  installCommand: string;
  sampleCode: string;
  githubStars?: number;
  githubRepo?: string;
  isReleased?: boolean;
}
