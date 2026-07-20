<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class ProviderBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::service_provider;
    }

    protected function getStubPath(): string
    {
        return Config::get('');
    }

    protected function getReplacements(): array
    {
        return [

        ];
    }
}
