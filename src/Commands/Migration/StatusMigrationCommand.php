<?php

namespace Strides\Module\Commands\Migration;

use Illuminate\Console\Command;
use Strides\Module\Enums\MigrationCommandsEnum;
use Symfony\Component\Console\Input\InputArgument;

class StatusMigrationCommand extends BaseActionCommand
{

    protected $name = 'module:migrate-status';
    protected $description = 'Status for all module migrations';

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a module|model with this name.'],
        ];
    }

    protected function getMigrationCommand(): MigrationCommandsEnum
    {
        return MigrationCommandsEnum::status;
    }
}
