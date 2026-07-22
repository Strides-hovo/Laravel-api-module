<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Facades\Module;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;

abstract class MigrationActionCommand extends Command
{
    protected string $moduleName;

    protected string $relativePath;

    protected string $seedClass;

    abstract public function handleCommand(): int;

    public function handle(): int
    {
        $argument = $this->argument('moduleName');
        $moduleNameParam = is_string($argument) || is_null($argument) ? $argument : null;

        if (! $this->setModuleName($moduleNameParam)) {
            $this->error('The module name is required!');

            return self::FAILURE;
        }

        if (! Module::exists($this->moduleName)) {
            $this->error('This module does not exist in the project.');

            return self::FAILURE;
        }

        $this
            ->setRelativePath()
            ->setSeedClass();

        return $this->handleCommand();
    }

    public function setRelativePath(): self
    {
        $relativePath = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::migration);
        if ($this->hasArgument('fileName')) {
            $fileName = $this->argument('fileName');
            if (is_string($fileName) && $fileName !== '') {
                if (! str_ends_with($fileName, '.php')) {
                    $fileName .= '.php';
                }
                $relativePath = $relativePath.DIRECTORY_SEPARATOR.$fileName;
            }
        }
        $this->relativePath = $relativePath;

        return $this;
    }

    protected function setModuleName(?string $moduleName): bool
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

    public function setSeedClass(): self
    {
        $this->seedClass = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::seeder, FileNameFactory::make($this->moduleName, BuilderKeysEnum::seeder));

        return $this;
    }
}
