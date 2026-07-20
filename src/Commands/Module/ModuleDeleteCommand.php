<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Facades\Module;
use Strides\Module\ModuleHelper;
use Symfony\Component\Console\Input\InputArgument;

class ModuleDeleteCommand extends Command
{
    protected $name = 'module:delete';
    protected $description = 'Delete a module without deleting its files';

    public function handle(): int
    {
        $argument = $this->argument('moduleName');
        $moduleName = is_string($argument) ? Str::ucfirst($argument) : '';

        if (!Module::exists($moduleName)) {
            $this->error('This module does not exist in the project.');

            return self::FAILURE;
        }
        $confirm = $this->confirm('Are you sure you want to remove this module ?, all database tables associated with this module will also be deleted.');

        if ($confirm) {
            $relativePath = ModuleHelper::namespace($moduleName, BuilderKeysEnum::migration);

            $this->call('migrate:rollback', [
                '--path' => $relativePath,
            ]);

            Module::delete($moduleName);
            $this->info("Module [{$moduleName}] deleted successfully.");
            $this->line('<comment>Note:</comment> Module files are kept. Use <info>module:make ' . $moduleName . '</info> to re-created.');
        } else {
            $this->info("Module [{$moduleName}] deletion canceled.");
        }

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'The name of the module to delete.'],
        ];
    }
}
