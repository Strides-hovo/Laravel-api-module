<?php

namespace Strides\Module\Builders;

use Strides\Module\Enums\BuilderKeysEnum;

class ResourceBuilder extends AbstractBuilder
{

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::resource;
    }
}
