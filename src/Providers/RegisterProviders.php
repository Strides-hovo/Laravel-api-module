<?php

namespace Strides\Module\Providers;

use Illuminate\Support\ServiceProvider;
use Strides\Module\Contracts\MigrationFacadeInterface;
use Strides\Module\Contracts\MigrationInfoFacadeInterface;
use Strides\Module\Facades\Migration\MigrationFacade;
use Strides\Module\Facades\Migration\MigrationInfoFacade;
use Strides\Module\Migrator;

class RegisterProviders extends ServiceProvider
{

    public function register()
    {
        $this->app->bind(MigrationFacadeInterface::class, function ($app, $parameters) {
            $command = $parameters['command'];
            $migrationInfo = $app->make(MigrationInfoFacade::class, ['command' => $command]);
            return new MigrationFacade($command, $migrationInfo);
        });

        $this->app->bind(MigrationInfoFacadeInterface::class, function ($app, $parameters) {
            $command = $parameters['command'];
            return new MigrationInfoFacade($command);
        });

        $this->app->bind(Migrator::class, function ($app, $parameters) {
            $moduleName = $parameters['moduleName'];
            $command = $parameters['command'];
            $migratorFacade = $app->make(MigrationFacadeInterface::class, ['command' => $command]);
            $migratorInfo = $app->make(MigrationInfoFacadeInterface::class, ['command' => $command]);

            return new Migrator($moduleName, $command, $migratorFacade, $migratorInfo);
        });
    }
}
