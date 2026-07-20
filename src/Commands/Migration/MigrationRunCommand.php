<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Strides\Module\Commands\MigrationActionCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MigrationRunCommand extends MigrationActionCommand
{
    protected $name = 'module:migrate';
    protected $description = 'Run Migration';

    public function handleCommand(): int
    {
        $options = [];

        if ($this->option('seed') || $this->option('seeder')) {
            $options['--seed'] = true;
            $options['--seeder'] = $this->seedClass;
        }

        $this->call('migrate', array_merge([
            '--path' => $this->relativePath,
            '--pretend' => $this->option('pretend'),
            '--step' => $this->option('step'),
            '--database' => $this->option('database'),
            '--graceful' => $this->option('graceful'),
        ], $options));

        return self::SUCCESS;
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
            ['pretend', null, InputOption::VALUE_NONE, 'Dump the SQL queries that would be run'],
            ['step', null, InputOption::VALUE_NONE, 'Force the migrations to be run so they can be rolled back individually'],
            ['graceful', null, InputOption::VALUE_NONE, 'Return a successful exit code even if an error occurs'],
            ['seed', null, InputOption::VALUE_NONE, 'Indicates if the seed task should be re-run'],
            ['seeder', null, InputOption::VALUE_OPTIONAL, 'The class name of the root seeder'],
            ['database', null, InputOption::VALUE_OPTIONAL, 'The database connection to use'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production'],
        ];
    }
}
