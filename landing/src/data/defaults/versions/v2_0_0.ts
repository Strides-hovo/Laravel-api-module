import { NavGroup, EnvVariable, SearchResult } from '../../../types';
import { ENV_VARIABLES_V1_0_0, SEARCH_ITEMS_V1_0_0 } from './v1_0_0';

export const NAV_GROUPS_V2_0_0: NavGroup[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: 'rocket_launch',
    items: [
      { id: 'instructions', label: 'Instructions' },
      { id: 'requirements', label: 'Requirements' },
      { id: 'installation', label: 'Installation & Setup' },
    ],
  },
  {
    id: 'core-concepts',
    label: 'Core Concepts',
    icon: 'auto_awesome_motion',
    items: [
      { id: 'commands', label: 'Artisan Commands' },
      { id: 'create-module', label: 'Create Module' },
      { id: 'transformer', label: 'Module Transformer', badge: 'New' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: 'database',
    items: [{ id: 'migrations', label: 'Migrations' }],
  },
  {
    id: 'community',
    label: 'Community',
    icon: 'groups',
    items: [{ id: 'github', label: 'GitHub' }],
  },
];

export const ENV_VARIABLES_V2_0_0: EnvVariable[] = [
  ...ENV_VARIABLES_V1_0_0,
  {
    key: 'API_MODULE_DEFAULT_VERSION',
    value: 'v1',
    defaultValue: 'v1',
    description: 'Version assigned to a module when none is specified during generation.',
    type: 'string',
  },
];

export const SEARCH_ITEMS_V2_0_0: SearchResult[] = [
  ...SEARCH_ITEMS_V1_0_0,
  {
    id: 's2.0-1',
    pageId: 'create-module',
    title: 'API Versioning',
    category: 'v2.0 Features',
    description: 'Add a new API version to an existing module without touching the current one.',
    codeSnippet: 'php artisan module:add-version Order --version=v2',
  },
  {
    id: 's2.0-2',
    pageId: 'create-module',
    title: 'Idempotent Generation',
    category: 'v2.0 Features',
    description: 'Re-running generation never overwrites existing files — only missing ones are created.',
  },
  {
    id: 's2.0-3',
    pageId: 'commands',
    title: 'Per-Version Config Toggle',
    category: 'Core Concepts',
    description: 'Enable or disable an API version at runtime via the module config, no code changes needed.',
    codeSnippet: "'versions' => ['v1' => ['enabled' => true], 'v2' => ['enabled' => true]]",
  },
];

export const META_V2_0_0 = {
  version: '2.0.0',
  releaseName: 'API Versioning Update',
  releaseDate: '2026-02-10',
  phpRequirement: '8.2+',
  laravelRequirement: '10+ (10, 11, 12, 13+)',
  description:
    'Adds first-class API versioning to module generation: multiple versions of a Controller, Request, and Resource can live side by side, existing files are never overwritten, and each version can be enabled or disabled independently through config.',
  features: [
    'Add a new API version to an existing module without touching the current one',
    'Idempotent generation — existing files are skipped, never silently overwritten',
    'Config-driven enable/disable per API version, no code changes required',
    'First version stays unsuffixed (OrderController), later versions get a suffix (OrderControllerV2)',
  ],
  installCommand: 'composer require strides/laravel-api-module:^2.0',
  sampleCode: `// Add a new API version to an existing module
php artisan module:add-version Order --version=v2

// Generates (existing v1 files are left untouched):
// Http/Controllers/OrderControllerV2.php
// Http/Requests/StoreOrderRequestV2.php
// Http/Resources/OrderResourceV2.php
// Routes/apiv2.php`,
  githubStars: 1284,
  githubRepo: 'laravel/framework',
  isReleased: true,
};
