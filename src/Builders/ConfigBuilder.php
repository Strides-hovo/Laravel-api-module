<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class ConfigBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::config;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.module.config');
    }

    protected function getReplacements(): array
    {
        return [
            '{{ module }}' => $this->moduleName,
        ];
    }
}
