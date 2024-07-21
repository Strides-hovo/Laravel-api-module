<?php

namespace Strides\Module\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\ModuleHelper;

abstract class BaseMakeCommand extends Command
{

    protected array $data;
    protected BuilderKeysEnum $generatorKey;

    public function handle(): void
    {
        $moduleName = $this->argument('moduleName');
        $fileName = $this->argument('fileName');
        $replacements = array_filter($this->options(), fn($option) => $option);

        $this->data = array_filter(
            compact('moduleName', 'fileName', 'replacements'),
            fn($v) => $v
        );
    }


    /**
     * @throws BuilderException
     */
    protected function checkExistence(): bool
    {
        $modulePath = ModuleHelper::module($this->argument('moduleName'));
        if (!is_dir($modulePath)) {
            return false;
        }
        $filename = $this->argument('fileName') ?: Str::afterLast($this->argument('moduleName'), '/');
        $filePath = $modulePath . DIRECTORY_SEPARATOR . ModuleHelper::generator($this->generatorKey->name) . DIRECTORY_SEPARATOR . $filename . '.php';
        if (File::exists($filePath)) {
            return true;
        }

        return false;
    }


    /**
     * @throws BuilderException
     */
    protected function showConfirm(string $type): bool
    {
        if ($this->checkExistence()) {
            if (!$this->confirm("Такой $type уже существует, вы хотите перезаписать $type в " . $this->argument('moduleName') . ' ?')) {
                $this->line("<info> Создание $type в " . $this->argument('moduleName') . ' отменен </info>');
                return false;
            }
            $this->comment("Создаем $type " . $this->argument('moduleName'));
        }
        return true;
    }


}
