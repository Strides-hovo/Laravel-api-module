<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;

class RouteBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::route;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.module.route');
    }

    protected function getReplacements(): array
    {

        $controllerName = FileNameFactory::make($this->moduleName, BuilderKeysEnum::controller);
        $controller = ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::controller, $controllerName);

        return [
            '{{ model }}' => Str::plural(Str::camel(ModuleHelper::singular($this->moduleName))),
            '{{ controller }}' => '\\'.$controller,
        ];
    }
}
