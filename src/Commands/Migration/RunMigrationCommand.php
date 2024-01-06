<?php
declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Strides\Module\Enums\MigrationCommandsEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class RunMigrationCommand extends BaseActionCommand
{

    protected $name = 'module:migrate';
    protected $description = 'Run Migration';


    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a module|model with this name.'],
        ];
    }


    protected function getOptions(): array
    {
        return [
            ['force', 'f', InputOption::VALUE_NONE, 'Flag to force associated migrations', null],
            ['seed', 's', InputOption::VALUE_NONE, 'Flag to path associated migrations', null],
            ['database', null, InputOption::VALUE_OPTIONAL, 'The database connection to use.'],
            ['step', null, InputOption::VALUE_OPTIONAL, 'Flag to path associated migrations', null],
            ['pretend', null, InputOption::VALUE_NONE, 'Dump the SQL queries that would be run.'],
        ];
    }


    protected function getMigrationCommand(): MigrationCommandsEnum
    {
        return MigrationCommandsEnum::run;
    }
}
