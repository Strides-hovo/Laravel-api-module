import { NavGroup, EnvVariable, SearchResult } from '../../../types';
import { ENV_VARIABLES_V1_0_0, SEARCH_ITEMS_V1_0_0 } from './v1_0_0';

export const NAV_GROUPS_V2_0_0: NavGroup[] = [
  {
    id: 'getting-started',
    label: 'Getting Started v2.0',
    icon: 'rocket_launch',
    items: [
      { id: 'instructions', label: 'Instructions (v2.0)' },
      { id: 'requirements', label: 'Requirements (PHP 8.3+)' },
      { id: 'installation', label: 'v2.0 Upgrade Guide' },
    ],
  },
  {
    id: 'core-concepts',
    label: 'Core Concepts',
    icon: 'auto_awesome_motion',
    items: [
      { id: 'commands', label: 'Artisan Commands' },
      { id: 'create-module', label: 'Create Module v2.0' },
      { id: 'transformer', label: 'Module Transformer', badge: 'New' },
    ],
  },
  {
    id: 'database',
    label: 'Database & Async',
    icon: 'database',
    items: [{ id: 'migrations', label: 'Schema & Event Sourcing' }],
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
    key: 'API_OPENAPI_SWAGGER',
    value: 'enabled',
    defaultValue: 'enabled',
    description: 'Auto-generates OpenAPI 3.1 specification at /api/documentation.',
    type: 'string',
  },
  {
    key: 'API_EVENT_BUS_ASYNC',
    value: 'true',
    defaultValue: 'true',
    description: 'Dispatches domain events asynchronously using Laravel Queues.',
    type: 'boolean',
  },
  {
    key: 'API_STRICT_CONTRACTS',
    value: 'true',
    defaultValue: 'true',
    description: 'Validates all outgoing JSON against auto-generated OpenAPI schemas.',
    type: 'boolean',
  },
];

export const SEARCH_ITEMS_V2_0_0: SearchResult[] = [
  ...SEARCH_ITEMS_V1_0_0,
  {
    id: 's2.0-1',
    pageId: 'instructions',
    title: 'OpenAPI 3.1 Integration',
    category: 'v2.0 Features',
    description: 'Automatic interactive Swagger UI generation directly from PHP docblocks and DTOs.',
  },
  {
    id: 's2.0-2',
    pageId: 'create-module',
    title: 'Async Event Bus',
    category: 'Core Concepts',
    description: 'Publish domain events across isolated modules without tight coupling.',
    codeSnippet: 'EventBus::publish(new UserRegisteredEvent($user));',
  },
];

export const META_V2_0_0 = {
  version: '2.0.0',
  releaseName: 'Next-Gen OpenAPI & Async Bus',
  releaseDate: '2026-02-10',
  phpRequirement: '8.3+',
  laravelRequirement: '10+ (10, 11, 12, 13+)',
  description:
    'Major overhaul featuring real-time OpenAPI 3.1 schema auto-generation, async domain event bus, GraphQL schema exports, and strict response contracts.',
  features: [
    'Built-in OpenAPI 3.1 & Swagger UI exporter',
    'Decoupled Async Domain Event Bus',
    'PHP 8.3 Typed Constants & Attributes',
    'Strict Contract Validation in Testing & Dev',
  ],
  installCommand: 'composer require strides/laravel-api-module:^2.0',
  sampleCode: `// v2.0.0 Next-Gen Contract Example
namespace App\\Modules\\User\\Contracts;

use LaravelApiModule\\Attributes\\ApiEndpoint;
use LaravelApiModule\\Attributes\\ProducesOpenApi;

#[ApiEndpoint(path: '/v2/users', method: 'POST')]
#[ProducesOpenApi(status: 201, schema: UserResponseSchema::class)]
class CreateUserEndpoint
{
    // ...
}`,
  githubStars: 1284,
  githubRepo: 'laravel/framework',
  isReleased: false,
};
