<?php

namespace Strides\Module\Builders;

use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class ServiceProviderBuilder extends AbstractBuilder
{


    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::service_provider;
    }


    protected function getTemplate(): string
    {
        return 'providers.service';
    }


    protected function getReplacements(): array
    {
        $namespace = ModuleHelper::namespace($this->moduleName) . '\\Providers';
        $moduleName = ModuleHelper::singular($this->moduleName);
        $className = "{$moduleName}ServiceProvider";


        return [
            'namespace' => $namespace,
            'class' => $className,
            'route_provider' => "RouteServiceProvider"
        ];
    }


    protected function getFileName(): string
    {
        return ModuleHelper::singular($this->moduleName) . 'ServiceProvider';
    }


    protected function getDirectory(): string
    {
        return ModuleHelper::module($this->moduleName, 'Providers');
    }
}
