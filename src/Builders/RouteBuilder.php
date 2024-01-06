<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class RouteBuilder extends AbstractBuilder
{

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::route;
    }

    protected function getFileName(): string
    {
        return 'api';
    }

    protected function getReplacements(): array
    {
        return [
            'model_name' => Str::plural(Str::snake(ModuleHelper::singular($this->moduleName))),
            ...$this->getReplacementsByRelation(['controller'])
        ];
    }
}
