<?php

namespace Strides\Module\Builders;

use Strides\Module\Enums\BuilderKeysEnum;

class RequestBuilder extends AbstractBuilder
{

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::request;
    }
}
