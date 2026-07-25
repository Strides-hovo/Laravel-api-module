import { NavGroup, EnvVariable, SearchResult } from '../../../types';

export const NAV_GROUPS_V1_0_0: NavGroup[] = [
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
    items: [{ id: 'issues', label: 'GitHub' }],
  },
];

export const ENV_VARIABLES_V1_0_0: EnvVariable[] = [
  {
    key: 'API_MODULE_STUBS',
    value: 'enabled',
    defaultValue: 'enabled',
    description: 'Generates customizable Artisan stub templates for new module files.',
    type: 'string',
  },
  {
    key: 'API_NAMESPACE',
    value: '"Modules"',
    defaultValue: '"Modules"',
    description: 'Root PSR-4 namespace prefix for all generated API modules.',
    type: 'string',
  },
  {
    key: 'API_STRICT_MODE',
    value: 'false',
    defaultValue: 'false',
    description: 'Enforces strict JSON schema validation and response structure.',
    type: 'boolean',
  },
  {
    key: 'API_AUTO_DISCOVERY',
    value: 'true',
    defaultValue: 'true',
    description: 'Automatically registers routes, migrations, and service providers.',
    type: 'boolean',
  },
];

export const SEARCH_ITEMS_V1_0_0: SearchResult[] = [
  {
    id: 's1',
    pageId: 'instructions',
    title: 'Overview & Introduction',
    category: 'Getting Started',
    description: 'One toolkit for generating clean, isolated modules with a single artisan command.',
  },
  {
    id: 's2',
    pageId: 'installation',
    title: 'Composer Installation',
    category: 'Installation',
    description: 'Pull the module framework into your Laravel application using Composer.',
    codeSnippet: 'composer require strides/laravel-api-module',
  },
  {
    id: 's3',
    pageId: 'installation',
    title: 'Configure Autoloader',
    category: 'Installation',
    description: 'Add the Modules namespace to your composer.json PSR-4 autoload block.',
    codeSnippet: '"Modules\\\\": "Modules/"',
  },
  {
    id: 's4',
    pageId: 'commands',
    title: 'Artisan Commands List',
    category: 'Core Concepts',
    description: 'Complete list of all module Artisan commands (make, migrate, enable, disable, delete).',
    codeSnippet: 'php artisan module:list',
  },
  {
    id: 's5',
    pageId: 'create-module',
    title: 'Make API Module Command',
    category: 'Core Concepts',
    description: 'Scaffold a complete domain-driven API module with controller, model, migration, and routes.',
    codeSnippet: 'php artisan module:make UserManagement --all',
  },
  {
    id: 's5_1',
    pageId: 'transformer',
    title: 'Module Transformer Engine',
    category: 'Core Concepts',
    description: 'Extends Laravel JSON Resources with standard data and status payload structure, and query builder for includes.',
    codeSnippet: 'OrderTransformer::make($order, 200)',
  },
  {
    id: 's6',
    pageId: 'migrations',
    title: 'Module Migrations',
    category: 'Database',
    description: 'Decentralized migration architecture with automatic path discovery.',
    codeSnippet: 'php artisan module:migrate UserAuth',
  },
  {
    id: 's7',
    pageId: 'migrations',
    title: 'Rollback & Refresh Migrations',
    category: 'Database',
    description: 'Revert specific module migration states without affecting core application tables.',
    codeSnippet: 'php artisan module:migrate-rollback UserAuth --step=1',
  },
  {
    id: 's8',
    pageId: 'requirements',
    title: 'PHP & Laravel Compatibility',
    category: 'Getting Started',
    description: 'Check PHP 8.2+ and Laravel 10/11/12 compatibility requirements.',
  },
];

export const META_V1_0_0 = {
  version: '1.0.0',
  releaseName: 'Genesis Release',
  releaseDate: '2025-01-15',
  phpRequirement: '8.1+',
  laravelRequirement: '10+ (10, 11, 12, 13+)',
  description:
    'Core isolated module structure, standard controller generation, PSR-4 autoloader, and basic JSON API response wrappers.',
  features: [
    'Modular PSR-4 structure for Laravel',
    'Artisan scaffolding: php artisan module:make',
    'Standardized JSON response envelope',
    'Independent module migrations directory',
  ],
  installCommand: 'composer require strides/laravel-api-module:^1.0',
  sampleCode: `// v1.0.0 Controller Example
namespace App\\Modules\\User\\Controllers;

use LaravelApiModule\\Core\\ApiResponse;

class UserController
{
    public function index() {
        return ApiResponse::success(['users' => []]);
    }
}`,
  githubStars: 1284,
  githubRepo: 'laravel/framework',
  isReleased: true,
};
