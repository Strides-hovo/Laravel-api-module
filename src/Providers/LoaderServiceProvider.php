<?php

namespace Strides\Module\Providers;

use Illuminate\Support\ServiceProvider;
use Strides\Module\ModuleHelper;

class LoaderServiceProvider extends ServiceProvider
{

    public function register()
    {
        $this->setMigrations()->setConfig();
    }


    public function boot(): void
    {
        if (is_dir(dirname(__DIR__) . '/templates/')) {
            $this->loadViewsFrom(dirname(__DIR__) . '/templates', 'strides-module');
        }
    }


    private function setMigrations()
    {
        $migrationsDir = $this->getMigrationsDir();

        foreach ($migrationsDir as $migration) {
            $this->loadMigrationsFrom($migration);
        }
        return $this;
    }


    private function setConfig()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../Config/config.php',
            'module'
        );
        return $this;
    }

    private function getMigrationsDir()
    {
        $moduleNames = ModuleHelper::getModulesNames();
        if (empty($moduleNames)) return [];

        return array_map(function ($moduleName) {
            $directory = ModuleHelper::module($moduleName, ModuleHelper::generator('migration'));
            return ($directory);
        }, array_keys($moduleNames));
    }


}
