<?php

namespace Strides\Module\Commands\Migration;

use Strides\Module\Enums\MigrationCommandsEnum;
use Symfony\Component\Console\Input\InputArgument;

class SeedMigrationCommand extends BaseActionCommand
{

    protected $name = 'module:seed';
    protected $description = 'Run database seeder from the specified module or from all modules.';

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a module|model with this name.'],
        ];
    }

    protected function getMigrationCommand(): MigrationCommandsEnum
    {
        return MigrationCommandsEnum::seed;
    }
}
