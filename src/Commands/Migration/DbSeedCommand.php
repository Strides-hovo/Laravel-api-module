<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Strides\Module\Commands\MigrationActionCommand;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class DbSeedCommand extends MigrationActionCommand
{
    protected $name = 'module:seed';

    protected $description = 'Fresh Migration from module';

    public function handleCommand(): int
    {

        $fileName = FileNameFactory::make($this->moduleName, BuilderKeysEnum::seeder);
        $class = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::seeder, $fileName);


        return $this->call('db:seed', [
            '--class' => $class,
            '--force' => $this->option('force')
        ]);

    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a migration with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['database', null, InputOption::VALUE_OPTIONAL, 'The database connection to use'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production'],
        ];
    }
}
