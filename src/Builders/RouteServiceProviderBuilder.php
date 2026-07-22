<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class RouteServiceProviderBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::route_service_provider;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.provider.route');
    }

    protected function getReplacements(): array
    {
        return array_merge(parent::getReplacements(), [
            '{{ route_file }}' => ModuleHelper::normalizePath(Config::get('module.namespace').DIRECTORY_SEPARATOR."{$this->moduleName}/Routes/api.php"),
        ]);
    }
}
