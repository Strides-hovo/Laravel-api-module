<?php

namespace Strides\Module\Commands\Migration;


use Strides\Module\Enums\MigrationCommandsEnum;
use Symfony\Component\Console\Input\InputArgument;

class ResetMigrationCommand extends BaseActionCommand
{

    protected $name = 'module:migrate-reset';
    protected $description = 'Reset for all module migrations';

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a module|model with this name.'],
        ];
    }

    protected function getMigrationCommand(): MigrationCommandsEnum
    {
        return MigrationCommandsEnum::reset;
    }
}
