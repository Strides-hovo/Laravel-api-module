<?php

namespace Strides\Module\Providers;

use Illuminate\Support\ServiceProvider;
use Strides\Module\Commands\ControllerMakeCommand;
use Strides\Module\Commands\Migration\MigrationMakeCommand;
use Strides\Module\Commands\Migration\RefreshMigrationCommand;
use Strides\Module\Commands\Migration\ResetMigrationCommand;
use Strides\Module\Commands\Migration\RollbackMigrationCommand;
use Strides\Module\Commands\Migration\RunMigrationCommand;
use Strides\Module\Commands\Migration\SeedMigrationCommand;
use Strides\Module\Commands\Migration\StatusMigrationCommand;
use Strides\Module\Commands\ModelMakeCommand;
use Strides\Module\Commands\ModuleMakeCommand;
use Strides\Module\Facades\ModuleFacade;


class ModuleServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        $this->app->register(LoaderServiceProvider::class);
        $this->app->register(RegisterProviders::class);


        $this->registerProviders();
    }


    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands($this->commands);
        }

        $this->publishes([
            __DIR__ . '/../Config/config.php' => config_path('module.php'),
        ]);
    }


    private function registerProviders(): void
    {
        $providers = ModuleFacade::getModuleProviderClasses();
        foreach ($providers as $providerClass) {
            if (class_exists($providerClass)) {
                $this->app->register($providerClass);
            }
        }
    }


    private array $commands = [
        ControllerMakeCommand::class,
        ModelMakeCommand::class,
        MigrationMakeCommand::class,
        ModuleMakeCommand::class,
        RunMigrationCommand::class,
        RollbackMigrationCommand::class,
        StatusMigrationCommand::class,
        ResetMigrationCommand::class,
        RefreshMigrationCommand::class,
        SeedMigrationCommand::class
    ];
}
