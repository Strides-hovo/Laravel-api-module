<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Strides\Module\Facades\Module;
use Symfony\Component\Console\Input\InputArgument;

class ModuleEnableCommand extends Command
{
    protected $name = 'module:enable';

    protected $description = 'Enable a module';

    public function handle(): int
    {
        $argument = $this->argument('moduleName');
        $moduleName = is_string($argument) ? Str::ucfirst($argument) : '';

        if (! Module::exists($moduleName)) {
            $this->error("Module [{$moduleName}] not found in modules_name.json.");

            return self::FAILURE;
        }

        if (Module::isEnabled($moduleName)) {
            $this->warn("Module [{$moduleName}] is already enabled.");

            return self::FAILURE;
        }

        Module::enable($moduleName);

        $this->info("Module [{$moduleName}] enabled successfully.");

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'The name of the module to enable.'],
        ];
    }
}
