<?php

declare(strict_types=1);

namespace Strides\Module\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Strides\Module\Dto\CommandDto;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\FileGenerator;
use Strides\Module\ModuleDirector;
use Strides\Module\ModuleHelper;

/**
 * Abstract base command providing unified execution blocks, user inputs, and template variables.
 */
abstract class BaseCommand extends Command
{
    protected BuilderKeysEnum $generatorKey;
    protected CommandDto $data;
    protected ModuleDirector $director;

    /**
     * Execute the subclass specific logic.
     */
    abstract public function handleCommand(): int;

    /**
     * Handle command invocation and execute sequential generation steps.
     */
    public function handle(): int
    {
        $this->setBaseData();

        if (empty($this->data->moduleName)) {
            $this->data->moduleName = $this->ask('Please enter the module name:');

            if (empty($this->data->moduleName)) {
                $this->error('The module name is required!');

                return self::FAILURE;
            }
        }
        $this->data->moduleName = Str::studly($this->data->moduleName);
        $this->setFileName();

        return $this->handleCommand();
    }

    /**
     * Confirm overwriting an already existing target module component file.
     */
    protected function showConfirm(string $type): bool
    {
        if (!$this->checkExistence($this->data, $this->generatorKey)) {
            return true;
        }

        // In non-interactive mode (testing), skip confirmation
        if (!$this->input->isInteractive()) {
            return false;
        }

        if (!$this->confirm("This $type already exists. Do you want to overwrite $type in " . ($this->data->moduleName ?? '') . '?')) {
            $this->line("<info>Creation of $type in " . ($this->data->moduleName ?? '') . ' canceled.</info>');

            return false;
        }

        $this->comment("Creating $type " . ($this->data->moduleName ?? ''));

        return true;
    }

    /**
     * Infer or define the filename of the target component class.
     */
    private function setFileName(): void
    {
        $moduleName = $this->data->moduleName ?? '';

        if (empty($this->data->fileName)) {
            $this->data->fileName = FileNameFactory::make($moduleName, $this->generatorKey);
        } elseif ($this->generatorKey === BuilderKeysEnum::migration) {
            $this->data->fileName = date('Y_m_d_His') . '_' . $this->data->fileName;
        }
    }

    /**
     * Extract console input arguments and parse command baseline parameters.
     */
    private function setBaseData(): void
    {
        $moduleNameArg = $this->argument('moduleName');
        $fileNameArg = $this->argument('fileName');

        $moduleName = is_string($moduleNameArg) ? $moduleNameArg : null;
        $fileName = is_string($fileNameArg) ? $fileNameArg : null;

        $this->data = new CommandDto(
            moduleName: $moduleName,
            fileName: $fileName,
            options: array_filter($this->options(), fn ($option) => (bool)$option)
        );
        $this->director = new ModuleDirector(new FileGenerator());
    }

    /**
     * Check if the generated code file already exists at the target path.
     */
    private function checkExistence(CommandDto $data, BuilderKeysEnum $generatorKey): bool
    {
        $modulePath = ModuleHelper::module($data->moduleName ?? '');
        if (!is_dir($modulePath)) {
            return false;
        }

        $filePath = ModuleHelper::normalizePath(
            $modulePath . DIRECTORY_SEPARATOR .
            ModuleHelper::generator($generatorKey) . DIRECTORY_SEPARATOR .
            $data->fileName . '.php'
        );

        return File::exists($filePath);
    }
}
