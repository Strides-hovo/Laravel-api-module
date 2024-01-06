<?php

namespace Strides\Module\Builders;

use Strides\Module\Builders\AbstractBuilder;
use Strides\Module\Enums\BuilderKeysEnum;

class CollectionBuilder extends AbstractBuilder
{
    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::collection;
    }
}
