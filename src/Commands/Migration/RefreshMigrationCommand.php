<?php

namespace Strides\Module\Commands\Migration;

use Strides\Module\Enums\MigrationCommandsEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class RefreshMigrationCommand extends BaseActionCommand
{

    protected $name = 'module:migrate-refresh';
    protected $description = 'Refresh for all module migrations';

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a module|model with this name.'],
        ];
    }


    protected function getOptions()
    {
        return [
            ['seed', 's', InputOption::VALUE_NONE, 'Flag to path associated migrations', null],
            ['step', null, InputOption::VALUE_OPTIONAL, 'Flag to path associated migrations', null],
        ];
    }


    protected function getMigrationCommand(): MigrationCommandsEnum
    {
        return MigrationCommandsEnum::refresh;
    }
}
