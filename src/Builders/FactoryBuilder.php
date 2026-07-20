<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class FactoryBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.factory.main');
    }

    protected function getReplacements(): array
    {
        $model = '';
        if (isset($this->options['model'])) {
            $model = '\\' . ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::model, $this->options['model']);
        }

        return array_merge(parent::getReplacements(), [
            '{{ model }}' => $model,
        ]);
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::factory;
    }
}
