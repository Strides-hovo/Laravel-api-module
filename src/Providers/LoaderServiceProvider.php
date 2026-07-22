<?php

declare(strict_types=1);

namespace Strides\Module\Providers;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Facades\Module;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;

class LoaderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this
            ->setConfig()
            ->setMigrations()
            ->setProviders()
            ->setFactories()
            ->setModuleConfigs();
    }

    public function boot(): void
    {
        $this->setView();
        $this->publishModuleConfigs();
    }

    private function setConfig(): self
    {
        // Merged base vs public config
        $baseConfig = require __DIR__.'/../Config/base.php';
        $publicConfig = require __DIR__.'/../Config/config.php';
        $mergedGenerators = collect((array) $baseConfig['paths']['generator'])
            ->merge((array) $publicConfig['paths']['generator'])
            ->all();

        $finalConfig = $publicConfig;
        $finalConfig['paths']['generator'] = $mergedGenerators;

        $this->app->make('config')->set('module', $finalConfig);

        $this->mergeConfigFrom(__DIR__.'/../Config/stub.php', 'module-stub');

        return $this;
    }

    private function setView(): void
    {
        $modules = Module::allEnabled();

        foreach ($modules as $module) {
            $path = Config::get('module.namespace').DIRECTORY_SEPARATOR.$module.DIRECTORY_SEPARATOR.'resources/views';
            $this->loadViewsFrom(
                base_path($path),
                Str::lower($module)
            );
        }
    }

    private function setMigrations(): self
    {
        $modules = Module::allEnabled();
        foreach ($modules as $module) {
            $dir = ModuleHelper::module($module, ModuleHelper::generator(BuilderKeysEnum::migration));
            $this->loadMigrationsFrom($dir);
        }

        return $this;
    }

    private function setProviders(): self
    {
        $modules = Module::allEnabled();
        foreach ($modules as $module) {
            $dir = ModuleHelper::namespace($module, BuilderKeysEnum::service_provider);
            $provider = $dir.DIRECTORY_SEPARATOR.ModuleHelper::singular($module).'ServiceProvider';
            $file = ModuleHelper::path(ModuleHelper::singular($module), BuilderKeysEnum::service_provider);

            if (File::exists("{$file}.php")) {
                if (class_exists($provider)) {
                    $this->app->register($provider);
                }
            }
        }

        return $this;
    }

    private function setFactories(): self
    {
        /**
         * @param  string  $modelClass
         * @return string|null
         */
        $factoryCallback = function (string $modelClass) {
            $moduleNamespace = Config::get('module.namespace');

            if (! str_starts_with($modelClass, $moduleNamespace)) {
                return null;
            }

            $module = explode('\\', $modelClass)[1];

            /** @var class-string<Factory> $factoryClass */
            $factoryClass = ModuleHelper::namespace($module, BuilderKeysEnum::factory, FileNameFactory::make($module, BuilderKeysEnum::factory));

            return $factoryClass;
        };

        Factory::guessFactoryNamesUsing($factoryCallback);

        /**
         * @param  Factory  $factory
         * @return string|null
         */
        $modelCallback = function (Factory $factory) {
            $factoryClass = get_class($factory);
            $moduleNamespace = Config::get('module.namespace');

            if (! str_starts_with($factoryClass, $moduleNamespace)) {
                return null; // Same question regarding the non-module case
            }

            $module = explode('\\', $factoryClass)[1];
            $basename = Str::replaceLast('Factory', '', class_basename($factoryClass));

            /** @var class-string<Model> $modelClass */
            $modelClass = ModuleHelper::namespace($module, BuilderKeysEnum::model).'\\'.$basename;

            return $modelClass;
        };

        Factory::guessModelNamesUsing($modelCallback);

        return $this;
    }

    /**
     * Merges config.php of each enabled module into the global Laravel configuration.
     * Works "out of the box" without requiring vendor:publish.
     */
    private function setModuleConfigs(): self
    {
        $modules = Module::allEnabled();

        foreach ($modules as $module) {
            $configPath = ModuleHelper::path(
                $module,
                BuilderKeysEnum::config,
                FileNameFactory::make($module, BuilderKeysEnum::config)
            );

            $configFile = "{$configPath}.php";

            if (! File::exists($configFile)) {
                continue;
            }

            $configKey = strtolower($module);
            $this->mergeConfigFrom($configFile, $configKey);
        }

        return $this;
    }

    private function publishModuleConfigs(): void
    {
        $modules = Module::allEnabled();

        foreach ($modules as $module) {
            $configPath = ModuleHelper::path(
                $module,
                BuilderKeysEnum::config,
                FileNameFactory::make($module, BuilderKeysEnum::config)
            );

            $configFile = "{$configPath}.php";

            if (! File::exists($configFile)) {
                continue;
            }

            $configKey = strtolower($module);

            $this->publishes(
                [$configFile => config_path("{$configKey}.php")],
                "{$configKey}-config"
            );
        }
    }
}
