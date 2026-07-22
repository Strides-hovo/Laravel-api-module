<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class ResourceBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.resource.main', dirname(__DIR__).'/stubs/resource.stub');
    }

    protected function getReplacements(): array
    {

        $extend = ! empty($this->options) && array_key_exists('collection', $this->options)
                ? '\Illuminate\Http\Resources\Json\ResourceCollection'
                : '\Illuminate\Http\Resources\Json\JsonResource';

        return [
            '{{ namespace }}' => ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::resource),
            '{{ class }}' => $this->fileName,
            '{{ extend }}' => $extend,
        ];
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::resource;
    }
}
