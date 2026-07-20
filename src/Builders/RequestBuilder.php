<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class RequestBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.request.main', dirname(__DIR__) . '/stubs/request.stub');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::request;
    }
}
