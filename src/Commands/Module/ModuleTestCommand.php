<?php

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ModuleTestCommand extends Command
{

    protected $name = 'module:test';

    protected $description = 'Run module tests';

    private string $moduleName;

    public function handle(): int
    {



        return self::SUCCESS;
    }


    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'The name of the module to delete.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['force', 'f', InputOption::VALUE_NONE, 'Force the operation to run without confirmation prompt.'],
            ['type', 't', InputOption::VALUE_OPTIONAL, 'The test type (unit or feature)', 'unit'],
        ];
    }
}