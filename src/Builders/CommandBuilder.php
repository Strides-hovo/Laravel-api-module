<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;

class CommandBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.command.main');
    }

    protected function getReplacements(): array
    {
        return array_merge(parent::getReplacements(), [
            '{{ name }}' => Str::kebab($this->fileName),
        ]);
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::command;
    }
}
