<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class RouteServiceProviderBuilder extends AbstractBuilder
{

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::route_service_provider;
    }

    protected function getTemplate(): string
    {
        return 'providers.route';
    }

    protected function getFileName(): string
    {
        return 'RouteServiceProvider';
    }

    protected function getDirectory(): string
    {
        return ModuleHelper::module($this->moduleName, 'Providers');
    }

    protected function getReplacements(): array
    {

        $namespace = ModuleHelper::namespace($this->moduleName) . '\\Providers';
        $className = 'RouteServiceProvider';

        return [
            'namespace' => $namespace,
            'class' => $className,
            'route_file' => Config::get('module.namespace') . DIRECTORY_SEPARATOR . "{$this->moduleName}/Routes/api.php"
        ];
    }
}
