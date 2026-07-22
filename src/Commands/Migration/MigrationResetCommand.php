<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Strides\Module\Commands\MigrationActionCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MigrationResetCommand extends MigrationActionCommand
{
    protected $name = 'module:migrate-reset';

    protected $description = 'Reset Module Migrations';

    public function handleCommand(): int
    {
        $this->call('migrate:reset', [
            '--path' => $this->relativePath,
            '--pretend' => $this->option('pretend'),
            '--database' => $this->option('database'),
        ]);

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
            ['database', null, InputOption::VALUE_OPTIONAL, 'The database connection to use'],
        ];
    }
}
