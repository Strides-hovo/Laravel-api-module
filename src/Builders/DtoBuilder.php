<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class DtoBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.dto.main');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::dto;
    }
}
