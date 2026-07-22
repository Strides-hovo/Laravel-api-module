<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;

class TransformerBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.transformer.main', dirname(__DIR__).'/stubs/transformer.stub');
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::transformer;
    }
}
