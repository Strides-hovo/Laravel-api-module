<?php

declare(strict_types=1);

namespace Strides\Module\Commands\Module;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Facades\Module;
use Strides\Module\ModuleHelper;

class ModuleOptimizeCommand extends Command
{
    protected $name = 'module:optimize';
    protected $description = 'Remove modules from modules_name.json whose directories no longer exist';

    /**
     * Модули, реально найденные на диске.
     * Формат: [name, name, ...]
     */
    private array $modulesOnDisk = [];

    public function handle(): int
    {
        $registeredModules = Module::all();
        $this->modulesOnDisk = Module::scan();

        if (empty($registeredModules) && empty($this->modulesOnDisk)) {
            $this->info('Nothing to optimize — no modules found anywhere.');

            return self::SUCCESS;
        }

        $diskModulesIndex = array_fill_keys($this->modulesOnDisk, true);
        $staleInJson = array_diff_key($registeredModules, $diskModulesIndex);
        $missingInJson = array_diff_key($diskModulesIndex, $registeredModules);

        if (empty($staleInJson) && empty($missingInJson) && !$this->hasInvalidModules()) {
            $this->info('Everything is synchronized and valid. Nothing to optimize.');

            return self::SUCCESS;
        }

        $this->removeStaleEntries($staleInJson);
        $this->reconcileDiskModules($missingInJson);

        return self::SUCCESS;
    }

    /**
     * Проверяет, есть ли среди модулей на диске такие, у которых
     * отсутствует Service Provider (то есть модуль невалиден).
     */
    private function hasInvalidModules(): bool
    {
        foreach ($this->modulesOnDisk as $name) {
            if (!File::exists($this->serviceProviderPath($name))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Удаляет из JSON записи, для которых нет физической директории на диске.
     *
     * @param array<string, mixed> $staleInJson
     */
    private function removeStaleEntries(array $staleInJson): void
    {
        if (empty($staleInJson)) {
            return;
        }

        $this->warn('Found stale entries in JSON (no physical directory):');
        foreach (array_keys($staleInJson) as $name) {
            $this->line("  - {$name}");
            Module::delete($name);
        }
    }

    /**
     * Проходит по модулям на диске и для каждого:
     *  - если он невалиден (нет Service Provider) — предлагает удалить его;
     *  - если он валиден, но не зарегистрирован в JSON — предлагает активировать.
     *
     * @param array<string, mixed> $missingInJson
     */
    private function reconcileDiskModules(array $missingInJson): void
    {
        foreach ($this->modulesOnDisk as $name) {
            if (!File::exists($this->serviceProviderPath($name))) {
                $this->handleInvalidModule($name);
                continue;
            }

            if (array_key_exists($name, $missingInJson)) {
                $this->handleUnregisteredModule($name);
            }
        }
    }

    private function handleInvalidModule(string $name): void
    {
        $confirmed = $this->confirm(
            "Модуль '{$name}' невалиден (отсутствует Service Provider). Хотите удалить его запись и папку?"
        );

        if (!$confirmed) {
            return;
        }

        Module::delete($name);
        $this->info("Модуль '{$name}' успешно удалён.");
    }

    private function handleUnregisteredModule(string $name): void
    {
        $this->info("Найден незарегистрированный модуль: <comment>{$name}</comment>");

        if ($this->confirm("Хотите зарегистрировать (активировать) модуль '{$name}'?")) {
            Module::enable($name);
            $this->info("Модуль '{$name}' успешно активирован.");
        }
    }

    private function serviceProviderPath(string $name): string
    {
        return ModuleHelper::normalizePath(ModuleHelper::namespace(
            $name,
            BuilderKeysEnum::service_provider
        ));
    }
}
