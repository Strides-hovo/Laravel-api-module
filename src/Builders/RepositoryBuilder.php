<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class RepositoryBuilder extends BaseBuilder
{
    public bool $isSolo = false;

    protected function getStubPath(): string
    {
        return $this->isSolo
            ? Config::get('module-stub.repository.solo')
            : Config::get('module-stub.repository.main');
    }

    protected function getReplacements(): array
    {

        $model = ! empty($this->options) && array_key_exists('model', $this->options)
                 ? $this->options['model']
                 : $this->moduleName;

        return [
            '{{ namespace }}' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::repository),
            '{{ class }}' => $this->fileName,
            '{{ model }}' => ModuleHelper::modelFqcn($model),
        ];
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::repository;
    }
}
