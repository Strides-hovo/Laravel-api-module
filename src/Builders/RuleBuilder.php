<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class RuleBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.rule.main');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::rule;
    }
}
