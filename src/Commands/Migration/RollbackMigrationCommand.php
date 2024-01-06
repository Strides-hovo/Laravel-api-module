<?php
declare(strict_types=1);

namespace Strides\Module\Commands\Migration;

use Strides\Module\Enums\MigrationCommandsEnum;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class RollbackMigrationCommand extends BaseActionCommand
{

    protected $name = 'module:migrate-rollback';
    protected $description = 'Status for all module migrations';

    public const ACTION = 'Rollback';


    protected function getArguments()
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'The name of module will be used.'],
        ];
    }

    protected function getOptions()
    {
        return [
            ['database', null, InputOption::VALUE_OPTIONAL, 'The database connection to use.'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production.'],
            ['pretend', null, InputOption::VALUE_NONE, 'Dump the SQL queries that would be run.'],
            ['step', null, InputOption::VALUE_OPTIONAL, 'Dump the SQL queries that would be run.'],
        ];
    }


    protected function getMigrationCommand(): MigrationCommandsEnum
    {
        return MigrationCommandsEnum::rollback;
    }
}
