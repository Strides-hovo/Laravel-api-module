<?php

namespace Strides\Module\Builders;

use Strides\Module\Enums\BuilderKeysEnum;

class MiddlewareBuilder extends AbstractBuilder
{
    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::middleware;
    }
}
