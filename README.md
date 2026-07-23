<div align="center">

# 🧩 Laravel API Module

### Modular architecture & code generator for Laravel APIs

> A code generation toolkit for building clean, scalable Laravel APIs with modular architecture.
> Designed for teams that work exclusively with APIs and follow the **Action → Repository → Transformer** pattern.

[![Latest Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![PHP](https://img.shields.io/badge/PHP-%3E%3D8.1-777BB4?style=flat&logo=php&logoColor=white)]()
[![Laravel](https://img.shields.io/badge/Illuminate-%5E9.0%20%7C%20%5E10.0%20%7C%20%5E11.0%20%7C%20%5E12.0%20%7C%20%5E13.0-FF2D20?style=flat&logo=laravel&logoColor=white)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

</div>

---

## Why This Package?

When building APIs with Laravel, you end up creating the same set of files for every resource: model, migration, controller, request, repository, transformer, action, and so on. This package automates that with Artisan generators designed specifically for API development — no Blade views, no web routes, no frontend scaffolding.

```bash
php artisan module:make-model Product --all
```

One command. Model, migration, factory, seeder, controller, repository, transformer — all generated with correct namespacing, PSR-12 formatting, and placed in an isolated module directory.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Module Management](#module-management)
- [Generators Reference](#generators-reference)
- [Architecture Pattern](#architecture-pattern)
- [Configuration](#configuration)
- [Migration Commands](#migration-commands)
- [Testing](#testing)
- [Support](#support)

---

## Requirements

| Dependency | Version |
|------------|---------|
| PHP | `>= 8.1` |
| Laravel | `^9.0 \| ^10.0 \| ^11.0 \| ^12.0 \| ^13.0` |
| Composer | Latest |

---


![Demo](module.gif)

## Installation

**1. Install via Composer**

```bash
composer require strides/laravel-api-module
```

**2. Publish configuration**

```bash
php artisan vendor:publish --provider="Strides\Module\Providers\ModuleServiceProvider"
```

**3. Register the Modules namespace in `composer.json`**

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Modules\\": "Modules/"
        }
    }
}
```

```bash
composer dump-autoload
```

**4. Add Modules test suite to `phpunit.xml`** *(optional but recommended)*

```xml
<testsuites>
    <testsuite name="Modules">
        <directory suffix="Test.php">Modules/*/Tests/*</directory>
    </testsuite>
</testsuites>
```

## Quick Start

### Create a complete module

```bash
php artisan module:make-module Product
```

This registers the module in `modules_name.json` and generates the full directory structure:

```
Modules/
└── Product/
    ├── Actions/
    ├── Database/
    │   ├── Factories/
    │   ├── Migrations/
    │   └── Seeders/
    ├── Entities/
    ├── Events/
    ├── Http/
    │   ├── Controllers/
    │   ├── Middleware/
    │   ├── Requests/
    │   ├── Resources/
    │   └── Transformers/
    ├── Jobs/
    ├── Listeners/
    ├── Providers/
    ├── Repositories/
    ├── Services/
    └── Tests/
```

## Configuration

Publish and edit `config/module.php` to customize module structure:

```php
return [
    'namespace'    => 'Modules',
    'modules'      => base_path('Modules'),
    'modules_name' => base_path('modules_name.json'),

    // Format generated .php files with laravel/pint (PSR-12) after creation.
    // Requires "laravel/pint" in require-dev. Silently skipped if not installed.
    'format_with_pint' => true,

    'paths' => [
        'modules' => base_path('Modules'),
    
        'generator' => [
            'model'        => ['path' => 'Entities',          'generate' => true],
            'migration'    => ['path' => 'Database/Migrations','generate' => true],
            'seeder'       => ['path' => 'Database/Seeders',   'generate' => true],
            'factory'      => ['path' => 'Database/Factories', 'generate' => false],
    
            'repository'   => ['path' => 'Repositories',       'generate' => true],
            'transformer'  => ['path' => 'Http/Transformers',  'generate' => true],
            'middleware'   => ['path' => 'Http/Middleware',    'generate' => false],
            'controller'   => ['path' => 'Http/Controllers',   'generate' => true],
            'request'      => ['path' => 'Http/Requests',      'generate' => true],
            'resource'     => ['path' => 'Http/Resources',     'generate' => false],
            'service'      => ['path' => 'Services',           'generate' => false],
            'action'       => ['path' => 'Actions',            'generate' => true],
    
            'mail'         => ['path' => 'Mail',               'generate' => false],
            'notification' => ['path' => 'Notification',       'generate' => false],
            'dto'          => ['path' => 'Dto',                'generate' => false],
            'rule'         => ['path' => 'Http/Rules',          'generate' => false],
            'policy'       => ['path' => 'Policies',           'generate' => false],
            'command'      => ['path' => 'Console/Commands',   'generate' => false],
    
            'event'        => ['path' => 'Events',             'generate' => false],
            'listener'     => ['path' => 'Listeners',          'generate' => false],
            'job'          => ['path' => 'Jobs',               'generate' => false],
            'cast'         => ['path' => 'Casts',              'generate' => false],
            'http'         => ['path' => '/',                  'generate' => true],
    
            'unit_test'    => ['path' => 'Tests/Unit',         'generate' => false],
            'feature_test' => ['path' => 'Tests/Feature',      'generate' => false],
        ],
    ],
];


```

## Module Management

Every module is registered in `modules_name.json` at the project root. The package provides four commands to manage module lifecycle.

### List all modules

```bash
php artisan module:list
```

```
+------------+-----------+--------------+----------------------------------+
| Module     | Status    | Path exists  | Path                             |
+------------+-----------+--------------+----------------------------------+
| Product    | Enabled   | ✓            | /var/www/Modules/Product         |
| Orders     | Disabled  | ✓            | /var/www/Modules/Orders          |
| Legacy     | Enabled   | ✗ Missing    | /var/www/Modules/Legacy          |
+------------+-----------+--------------+----------------------------------+

Total: 3  Enabled: 2  Disabled: 1  Missing: 1
```

### Enable / Disable a module

```bash
php artisan module:enable  Orders
php artisan module:disable Orders
```

Disabling a module prevents its service provider from loading — routes, migrations, and commands become inactive. Files are preserved.

### Clean up stale entries

```bash
php artisan module:optimize
```

Scans `modules_name.json` and removes entries whose directories no longer exist. Asks for confirmation before writing.

```
The following modules have no directory and will be removed:
  - Legacy

Proceed? (yes/no) [yes]:
Done. Removed 1 stale entry from modules_name.json.
```

---

## Generators Reference

### Module

| Command | Description |
|---------|-------------|
| `module:make-module {name}` | Create a complete module with full directory structure |

### Models & Data

| Command | Flags | Description |
|---------|-------|-------------|
| `module:make-model {module} {name}` | `-m` `-c` `-f` `-s` `-a` | Eloquent model with optional related files |
| `module:make-migration {module} {name}` | | Database migration |
| `module:make-seeder {module} {name}` | | Database seeder |
| `module:make-factory {module} {name}` | | Model factory |


**Model flags:**

| Flag | Long | Generates |
|------|------|-----------|
| `-m` | `--migration` | Migration |
| `-c` | `--controller` | Controller |
| `-f` | `--factory` | Factory |
| `-s` | `--seeder` | Seeder |
| `-a` | `--all` | All of the above |

### Controllers & HTTP

| Command | Flags | Description |
|---------|-------|-------------|
| `module:make-controller {module} {name}` | `-r` `-s` `-c` `-p` `-m` `-a` | API controller |
| `module:make-request {module} {name}` | | FormRequest validation class |
| `module:make-transformer {module} {name}` | | Data transformer for API responses |

**Controller flags:**

| Flag | Long           | Generates                 |
|------|----------------|---------------------------|
| `-r` | `--request`    | FormRequest class         |
| `-s` | `--resource`   | API Resource class        |
| `-c` | `--collection` | Resource Collection class |
| `-p` | `--repository` | Repository class          |
| `-m` | `--model`      | Model name for type hints |
| `-a` | `--all`        | All of the above          |
| `-T` | `--test`       | Unit test                 |

### Business Logic

| Command | Description |
|---------|-------------|
| `module:make-action {module} {name}` | Single-purpose invokable action class |
| `module:make-service {module} {name}` | Service class for complex operations |
| `module:make-repository {module} {name}` | Repository for data access abstraction |

### Events & Async

| Command | Flags | Description |
|---------|-------|-------------|
| `module:make-event {module} {name}` | `--listener[=Name]` | Event class. Optionally creates a linked Listener |
| `module:make-listener {module} {name}` | `--event=ClassName` | Listener. `--event=` typehints the `handle()` parameter |
| `module:make-job {module} {name}` | | Queueable job (`ShouldQueue` by default) |

**Event → Listener examples:**

```bash
# Create Event only
php artisan module:make-event Product ProductCreated

# Create Event + auto-generate a linked Listener
php artisan module:make-event Product ProductCreated --listener

# Create Event + Listener with a specific name
php artisan module:make-event Product ProductCreated --listener=SendProductNotification

# Create Listener with typed handle(ProductCreated $event)
php artisan module:make-listener Product SendProductNotification --event=ProductCreated
```

### Utilities

| Command                                                  | Description                |
|----------------------------------------------------------|----------------------------|
| `module:make-middleware {module} {name}`                 | HTTP middleware            |
| `module:make-test {module} {name} {type} default = unit` | Unit or Feature test class |

---

## Architecture Pattern

### Action → Repository → Transformer

This package is built around a clean three-layer API architecture:

```
HTTP Request
    │
    ▼
FormRequest (validation)
    │
    ▼
Controller  ──────────────────────────────┐
    │                                      │
    ▼                                      │
Action (business logic)                   │
    │                                      │
    ▼                                      │
Repository (data access)                  │
    │                                      │
    ▼                                      │
Transformer (response format) ◄───────────┘
    │
    ▼
JSON Response
```


## Transformers

The package provides a robust data transformation layer using `ModuleTransformer` and `TransformerCollection`. It extends Laravel's native API Resources to standardize JSON outputs, enforce strict performance guidelines (preventing accidental N+1 queries), and streamline handling of single models, collections, and paginated data.

### 1. Creating a Transformer

Every custom transformer must extend `Strides\Module\Transformers\ModuleTransformer` and implement the abstract **`transformModel($model): array`** method.

#### Example Implementation
```php
namespace App\Modules\User\Transformers;

use Strides\Module\Transformers\ModuleTransformer;

class UserTransformer extends ModuleTransformer
{
    /**
     * Define which relations are allowed to be included via query string.
     */
    protected array $availableIncludes = ['posts', 'profile'];

    /**
     * Abstract method that MUST be implemented.
     * Defines the raw transformation for a single model instance.
     *
     * @param \App\Models\User $model
     */
    public function transformModel($model): array
    {
        return [
            'id'    => $model->id,
            'name'  => $model->name,
            'email' => $model->email,
        ];
    }

    /**
     * Optional: Custom include method for 'posts' relation.
     * If omitted, the transformer will fallback to automatic $relatedData->toArray().
     */
    public function includePosts($posts)
    {
        // You can leverage another transformer for the relation
        return PostTransformer::collection($posts);
    }
}

```

### Component generators

Each command: `php artisan module:make-<type> <Module> <Name>`.

| Command | Generates | Key flags |
|---|---|---|
| `module:make-controller` | Controller | `--request`, `--resource`, `--transformer`, `--service`, `--action`, `--test`, `--all` |
| `module:make-model` | Eloquent model | `--migration`, `--controller`, `--request`, `--resource`, `--service`, `--transformer`, `--policy`, `--factory`, `--seed`, `--pivot`, `--morph-pivot`, `--test`, `--all` |
| `module:make-service` | Service class | — |
| `module:make-repository` | Repository class | `--model` |
| `module:make-action` | Action class (Index/Store/Update/Destroy) | — |
| `module:make-request` | Form Request | — |
| `module:make-resource` | API Resource | `--collection` |
| `module:make-transformer` | Transformer | — |
| `module:make-rule` | Validation rule | — |
| `module:make-policy` | Policy | `--model`, `--guard` |
| `module:make-factory` | Model factory | `--model` |
| `module:make-seeder` | Seeder | — |
| `module:make-middleware` | Middleware | — |
| `module:make-event` | Event class | — |
| `module:make-listener` | Listener class | `--event` |
| `module:make-job` | Job class | — |
| `module:make-mail` | Mailable class | `--view` |
| `module:make-notification` | Notification class | — |
| `module:make-dto` | DTO class | — |
| `module:make-command` | Module-scoped Artisan command | — |

### Per-module migrations

| Command | Description |
|---|---|
| `module:make-migration {module} {name}` | Creates a migration file inside the module. |
| `module:migrate {module}` | Runs the module's migrations. |
| `module:migrate-status {module}` | Shows migration status for the module. |
| `module:migrate-rollback {module}` | Rolls back the last migration batch. |
| `module:migrate-reset {module}` | Rolls back all migrations. |
| `module:migrate-refresh {module}` | Resets and re-runs migrations. |
| `module:migrate-fresh {module}` | Drops and recreates tables (`--drop-views`, `--drop-types`). |

Standard Laravel flags apply where relevant: `--force`, `--seed`, `--seeder`, `--database`, `--pretend`, `--step`.

---

## 6. Example

```bash
# Create the module
php artisan module:make-module Blog

# Model + migration + factory + seeder + policy + controller + test
php artisan module:make-model Blog Post --all

# Controller side: request + resource + transformer + service + action + test
php artisan module:make-controller Blog Post --all

# Run this module's migrations only
php artisan module:migrate Blog --seed

# Toggle the module on/off without deleting it
php artisan module:disable Blog
php artisan module:enable Blog
```

```php
php artisan module:make-controller Blog --all

class BlogController extends Controller
{
    public function index(BlogRequest $request, BlogIndexAction $action): TransformerCollection
    {
        $blogs = $action->handle($request->validated());

        return BlogTransformer::collection($blogs, 200);
    }

    public function store(BlogRequest $request, BlogStoreAction $action): ModuleTransformer
    {
        $blog = $action->handle($request->validated());

        return BlogTransformer::make($blog, 201);
    }

    public function update(int|string $id, BlogRequest $request, BlogUpdateAction $action): ModuleTransformer
    {
        $blog = $action->handle($id, $request->validated());

        return BlogTransformer::make($blog, 200);
    }

    public function destroy(int|string $id, BlogDestroyAction $action): JsonResponse
    {
        $action->handle($id);

        return response()->json(null, 204);
    }
}

```

## Troubleshooting

**Migrations not found**
Ensure the module is registered in `modules_name.json` (it happens automatically when you use `module:make-module` or any `module:make-*` command). If you created files manually, run `module:optimize` to sync the file.

**Classes not autoloading**
Run `composer dump-autoload` after adding `"Modules\\": "Modules/"` to your `composer.json`.

**Service provider not loading**
Verify that `modules_name.json` contains your module name with `true`. Use `php artisan module:list` to inspect the state.

**Queue jobs not processing**
Jobs generated by `module:make-job` implement `ShouldQueue` by default. Ensure your queue driver is configured in `.env` (`QUEUE_CONNECTION=redis` or similar) and a worker is running.

---

## Testing
**OK (14 tests, 227 assertions)**




## License

MIT — see [LICENSE](LICENSE).

---

## Support

- 🐛 **Bug reports:** [GitHub Issues](https://github.com/Strides-hovo/Laravel-api-module/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Strides-hovo/Laravel-api-module/discussions)

---

*Inspired by [nWidart/laravel-modules](https://github.com/nWidart/laravel-modules). Built for teams that live in the API layer.*
