<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class ServiceProviderBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::service_provider;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.provider.service');
    }

    protected function getReplacements(): array
    {
        return array_merge(parent::getReplacements(), [
            '{{ route_provider }}' => 'RouteServiceProvider',
        ]);
    }
}
