import { NavGroup, EnvVariable, SearchResult } from '../../../types';
import { ENV_VARIABLES_V1_0_0, SEARCH_ITEMS_V1_0_0 } from './v1_0_0';

export const NAV_GROUPS_V1_5_0: NavGroup[] = [
  {
    id: 'getting-started',
    label: 'Getting Started v1.5',
    icon: 'rocket_launch',
    items: [
      { id: 'instructions', label: 'Instructions & v1.5 Notes' },
      { id: 'requirements', label: 'Requirements (PHP 8.2+)' },
      { id: 'installation', label: 'Installation & Setup' },
    ],
  },
  {
    id: 'core-concepts',
    label: 'Core Concepts',
    icon: 'auto_awesome_motion',
    items: [
      { id: 'commands', label: 'Artisan Commands' },
      { id: 'create-module', label: 'Create Module (+Actions)' },
      { id: 'transformer', label: 'Module Transformer', badge: 'New' },
    ],
  },
  {
    id: 'database',
    label: 'Database & Sync',
    icon: 'database',
    items: [{ id: 'migrations', label: 'Automated Migrations' }],
  },
  {
    id: 'community',
    label: 'Community',
    icon: 'groups',
    items: [{ id: 'github', label: 'GitHub' }],
  },
];

export const ENV_VARIABLES_V1_5_0: EnvVariable[] = [
  ...ENV_VARIABLES_V1_0_0,
  {
    key: 'API_DTO_TRANSFORM',
    value: 'true',
    defaultValue: 'true',
    description: 'Auto-transforms incoming request body into strongly-typed DTO instances.',
    type: 'boolean',
  },
  {
    key: 'API_ACTION_DISCOVERY',
    value: 'enabled',
    defaultValue: 'enabled',
    description: 'Enables single-action invokable controllers in domain actions.',
    type: 'string',
  },
];

export const SEARCH_ITEMS_V1_5_0: SearchResult[] = [
  ...SEARCH_ITEMS_V1_0_0,
  {
    id: 's1.5-1',
    pageId: 'create-module',
    title: 'Action Generation (v1.5)',
    category: 'Core Concepts',
    description: 'Scaffold invokable action classes inside App/Modules/{Module}/Actions.',
    codeSnippet: 'php artisan make:api-action UserManagement ProcessUser',
  },
  {
    id: 's1.5-2',
    pageId: 'commands',
    title: 'Artisan CLI Commands',
    category: 'Core Concepts',
    description: 'Complete list of all module Artisan commands (make, migrate, enable, disable, delete).',
  },
];

export const META_V1_5_0 = {
  version: '1.5.0',
  releaseName: 'Automated Action & DTO Update',
  releaseDate: '2025-06-20',
  phpRequirement: '8.2+',
  laravelRequirement: '10+ (10, 11, 12, 13+)',
  description:
    'Introduces dedicated Domain Action stubs, Data Transfer Object (DTO) auto-generation, automatic route discovery, and enhanced configuration tags.',
  features: [
    'PHP 8.2+ Readonly DTO Auto-mapping',
    'Invokable Domain Action classes generation',
    'Zero-config sub-domain route discovery',
    'Enhanced exception mapping with error codes',
  ],
  installCommand: 'composer require strides/laravel-api-module:^1.5',
  sampleCode: `// v1.5.0 Action-driven Example
namespace App\\Modules\\User\\Actions;

use App\\Modules\\User\\DTOs\\UserData;

readonly class CreateUserAction
{
    public function execute(UserData $data): User
    {
        return User::create($data->toArray());
    }
}`,
  githubStars: 1284,
  githubRepo: 'laravel/framework',
  isReleased: false,
};
