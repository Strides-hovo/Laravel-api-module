<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Strides\Module\Facades\Module;
use Symfony\Component\Console\Input\InputArgument;

class ModuleDisableCommand extends Command
{
    protected $name = 'module:disable';
    protected $description = 'Disable a module without deleting its files';

    public function handle(): int
    {
        $argument = $this->argument('moduleName');
        $moduleName = is_string($argument) ? Str::ucfirst($argument) : '';

        Module::disable($moduleName);
        $this->info("Module [{$moduleName}] disabled successfully.");
        $this->line('<comment>Note:</comment> Module files are kept. Use <info>module:enable ' . $moduleName . '</info> to re-enable.');

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'The name of the module to disable.'],
        ];
    }
}
