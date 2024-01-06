<?php

namespace Strides\Module\Builders;

use Strides\Module\Enums\BuilderKeysEnum;

class UnitTestBuilder extends AbstractBuilder
{

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::unit_test;
    }

    protected function getTemplate(): string
    {
        return 'test.unit';
    }
}
