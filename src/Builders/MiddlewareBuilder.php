<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class MiddlewareBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.middleware.main');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::middleware;
    }
}
