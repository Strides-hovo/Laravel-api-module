<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class UnitTestBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::unit_test;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.test.main');
    }
}
