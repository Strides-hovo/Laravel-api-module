<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class FeatureTestBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::feature_test;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.test.feature');
    }
}
