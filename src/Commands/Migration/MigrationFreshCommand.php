<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Strides\Module\Commands\MigrationActionCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MigrationFreshCommand extends MigrationActionCommand
{
    protected $name = 'module:migrate-fresh';
    protected $description = 'Fresh Migration from module';

    public function handleCommand(): int
    {
        $database = $this->option('database') ?: config('database.default');
        /** @var Connection $connection */
        $connection = DB::connection($database);

        if ($this->option('drop-views')) {
            $this->components->task('Dropping module views...', function () use ($connection) {
                $this->dropAllViews($connection);
            });
        }

        if ($this->option('drop-types') && $connection->getDriverName() === 'pgsql') {
            $this->components->task('Dropping module types...', function () use ($connection) {
                $this->dropAllTypes($connection);
            });
        }

        $this->call('migrate:reset', [
            '--path' => $this->relativePath,
            '--database' => $database,
            '--force' => $this->option('force'),
        ]);

        return $this->call('migrate', [
            '--path' => $this->relativePath,
            '--database' => $database,
            '--step' => $this->option('step'),
            '--force' => $this->option('force'),
            '--seed' => $this->option('seed') || !empty($this->option('seeder')),
            '--seeder' => $this->option('seeder'),
        ]);
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a migration with this name.'],
            ['fileName', InputArgument::OPTIONAL, 'Create a migration with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['drop-types', null, InputOption::VALUE_NONE, 'Drop all tables and types (PostgreSQL only)'],
            ['drop-views', null, InputOption::VALUE_NONE, 'Drop all views'],
            ['step', null, InputOption::VALUE_NONE, 'Force the migrations to be run so they can be rolled back individually'],
            ['seed', null, InputOption::VALUE_NONE, 'Indicates if the seed task should be re-run'],
            ['seeder', null, InputOption::VALUE_OPTIONAL, 'The class name of the root seeder'],
            ['database', null, InputOption::VALUE_OPTIONAL, 'The database connection to use'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production'],
        ];
    }

    private function dropAllViews(Connection $connection): void
    {
        $views = Schema::connection($connection->getName())->getViews();

        foreach ($views as $view) {
            $viewName = is_array($view) ? ($view['name'] ?? null) : ($view->name ?? null);
            if ($viewName) {
                $connection->statement("DROP VIEW IF EXISTS {$viewName}");
            }
        }
    }

    /**
     * Drop custom types (PostgreSQL) without utilizing Doctrine.
     */
    private function dropAllTypes(Connection $connection): void
    {
        $types = $connection->select("
        SELECT t.typname 
        FROM pg_type t 
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
        WHERE n.nspname = 'public' AND t.typtype = 'e'
    ");

        foreach ($types as $type) {
            $typeName = is_array($type) ? ($type['typname'] ?? null) : ($type->typname ?? null);

            if ($typeName) {
                $connection->statement("DROP TYPE IF EXISTS {$typeName} CASCADE");
            }
        }
    }
}
