<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Strides\Module\Facades\Module;
use Symfony\Component\Console\Input\InputArgument;

class ConfigPublishCommand extends Command
{
    protected $name = 'module:config-publish';
    protected $description = 'Publish config file';

    public function handle(): int
    {
        $input = $this->argument('moduleName');
        $inputString = is_string($input) ? $input : '';

        $configName = Str::lower($inputString);
        $moduleName = Str::title($inputString);

        if (!Module::exists($moduleName)) {
            $this->error('This module does not exist in the project.');

            return self::FAILURE;
        }

        $this->call('vendor:publish', [
            '--tag' => "{$configName}-config",
        ]);

        return self::SUCCESS;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::REQUIRED, 'The name of the module to publish config for.'],
        ];
    }
}
