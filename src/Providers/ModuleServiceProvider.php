<?php

declare(strict_types=1);

namespace Strides\Module\Providers;

use Illuminate\Support\ServiceProvider;
use Strides\Module\Commands\ActionMakeCommand;
use Strides\Module\Commands\CommandMakeCommand;
use Strides\Module\Commands\ControllerMakeCommand;
use Strides\Module\Commands\DtoMakeCommand;
use Strides\Module\Commands\EventMakeCommand;
use Strides\Module\Commands\FactoryMakeCommand;
use Strides\Module\Commands\JobMakeCommand;
use Strides\Module\Commands\ListenerMakeCommand;
use Strides\Module\Commands\MailMakeCommand;
use Strides\Module\Commands\MiddlewareMakeCommand;
use Strides\Module\Commands\Migration\MigrationFreshCommand;
use Strides\Module\Commands\Migration\MigrationMakeCommand;
use Strides\Module\Commands\Migration\MigrationRefreshCommand;
use Strides\Module\Commands\Migration\MigrationResetCommand;
use Strides\Module\Commands\Migration\MigrationRollbackCommand;
use Strides\Module\Commands\Migration\MigrationRunCommand;
use Strides\Module\Commands\Migration\MigrationStatusCommand;
use Strides\Module\Commands\ModelMakeCommand;
use Strides\Module\Commands\Module\ConfigPublishCommand;
use Strides\Module\Commands\Module\ModuleDeleteCommand;
use Strides\Module\Commands\Module\ModuleDisableCommand;
use Strides\Module\Commands\Module\ModuleEnableCommand;
use Strides\Module\Commands\Module\ModuleListCommand;
use Strides\Module\Commands\Module\ModuleOptimizeCommand;
use Strides\Module\Commands\ModuleMakeCommand;
use Strides\Module\Commands\NotificationMakeCommand;
use Strides\Module\Commands\PolicyMakeCommand;
use Strides\Module\Commands\RepositoryMakeCommand;
use Strides\Module\Commands\RequestMakeCommand;
use Strides\Module\Commands\ResourceMakeCommand;
use Strides\Module\Commands\RuleMakeCommand;
use Strides\Module\Commands\SeederMakeCommand;
use Strides\Module\Commands\ServiceMakeCommand;
use Strides\Module\Commands\TestMakeCommand;
use Strides\Module\Commands\TransformerMakeCommand;
use Strides\Module\Facades\ModuleManager;

/**
 * Service provider for registering module-specific services, configurations, and artisan commands.
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register module services and singletons in the container.
     */
    public function register(): void
    {
        $this->app->singleton('strides-module-manager', fn () => new ModuleManager); // Facade
        $this->app->register(LoaderServiceProvider::class);
    }

    /**
     * Bootstrap module application services, commands, and publish configurations.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands($this->commands);
        }

        $this->publishes([
            __DIR__.'/../Config/config.php' => config_path('module.php'),
        ]);

    }

    /**
     * List of artisan commands registered by this module.
     *
     * @var array<int, class-string>
     */
    private array $commands = [
        ControllerMakeCommand::class,
        ActionMakeCommand::class,
        RepositoryMakeCommand::class,
        ServiceMakeCommand::class,
        TransformerMakeCommand::class,
        RequestMakeCommand::class,
        ResourceMakeCommand::class,
        MiddlewareMakeCommand::class,
        JobMakeCommand::class,
        MailMakeCommand::class,
        NotificationMakeCommand::class,
        DtoMakeCommand::class,
        RuleMakeCommand::class,
        CommandMakeCommand::class,
        EventMakeCommand::class,
        ListenerMakeCommand::class,
        PolicyMakeCommand::class,
        FactoryMakeCommand::class,
        SeederMakeCommand::class,
        MigrationMakeCommand::class,
        ModelMakeCommand::class,
        MigrationStatusCommand::class,
        ModuleMakeCommand::class,
        MigrationStatusCommand::class,
        MigrationRunCommand::class,
        MigrationResetCommand::class,
        MigrationRollbackCommand::class,
        MigrationRefreshCommand::class,
        MigrationFreshCommand::class,

        ModuleListCommand::class,
        ModuleEnableCommand::class,
        ModuleDisableCommand::class,
        ModuleDeleteCommand::class,
        ModuleOptimizeCommand::class,
        ConfigPublishCommand::class,
        TestMakeCommand::class,
    ];
}
