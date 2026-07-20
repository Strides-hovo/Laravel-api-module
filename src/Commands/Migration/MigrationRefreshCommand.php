<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Strides\Module\Commands\MigrationActionCommand;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class MigrationRefreshCommand extends MigrationActionCommand
{
    protected $name = 'module:migrate-refresh';
    protected $description = 'Refresh Migration from  module';

    public function handleCommand(): int
    {
        $seeder = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::seeder, FileNameFactory::make($this->moduleName, BuilderKeysEnum::seeder));
        $options = [];

        if ($this->option('seed') || $this->option('seeder')) {
            $options['--seed'] = true;
            $options['--seeder'] = $seeder;
        }

        $this->call('migrate:refresh', array_merge([
            '--path' => $this->relativePath,
            '--step' => $this->option('step'),
            '--database' => $this->option('database'),
            '--force' => $this->option('force'),
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
            ['step', null, InputOption::VALUE_NONE, 'Force the migrations to be run so they can be rolled back individually'],
            ['seed', null, InputOption::VALUE_NONE, 'Indicates if the seed task should be re-run'],
            ['seeder', null, InputOption::VALUE_OPTIONAL, 'The class name of the root seeder'],
            ['database', null, InputOption::VALUE_OPTIONAL, 'The database connection to use'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production'],
        ];
    }
}
