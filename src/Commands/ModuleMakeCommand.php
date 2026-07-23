<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Str;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Facades\Module;
use Strides\Module\ModuleGenerator;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ModuleMakeCommand extends Command
{
    protected $name = 'module:make-module';

    protected $description = 'Create Module';

    private string $moduleName;

    /**
     * @throws BuilderException|BindingResolutionException
     */
    public function handle(): int
    {
        $argument = $this->argument('moduleName');
        $moduleNameParam = is_string($argument) || is_null($argument) ? $argument : null;

        if (! $this->setModuleName($moduleNameParam)) {
            $this->error('The module name is required!');

            return self::FAILURE;
        }

        if (!$this->option('force') && Module::exists($this->moduleName)) {
            if (! $this->confirm('This module already exists, do you want to overwrite the entire folder '.($this->moduleName).'?')) {
                $this->line('<info>Creation of module '.($this->moduleName ?? '').' canceled.</info>');

                return self::FAILURE;
            }
        }

        if (Module::exists($this->moduleName)){
            $this->comment('Cleaning old files from '.($this->moduleName));
            Module::delete($this->moduleName);
        }
        $this->comment('Creating module '.($this->moduleName));
        $statuses = ModuleGenerator::create($this->moduleName);

        foreach ($statuses as $relation => $file) {
            $type = Str::ucfirst($relation);
            $this->line("<fg=blue>INFO </> <fg=blue>[</>{$type}<fg=blue>]</> <info>created successfully.</info>");
        }

        return self::SUCCESS;
    }

    public function setModuleName(?string $moduleName): bool
    {
        if (empty($moduleName)) {
            $askedName = $this->ask('Please enter the module name:');
            if (empty($askedName)) {
                return false;
            }
            $moduleName = $askedName;
        }
        $this->moduleName = Str::title($moduleName);

        return true;
    }

    protected function getArguments(): array
    {
        return [
            ['moduleName', InputArgument::OPTIONAL, 'Create a Module with this name.'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production']
        ];
    }
}
