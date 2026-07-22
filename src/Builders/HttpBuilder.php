<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class HttpBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::http;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.http.main');
    }


    protected function getReplacements(): array
    {

        $url = url('/api');
        $path = Str::plural(Str::camel(ModuleHelper::singular($this->moduleName)));
        $uri = "$url/$path";

        return [
            '{{ url_1 }}' => $uri,
            '{{ url_2 }}' => $uri,
            '{{ url_3 }}' => "{$uri}/1",
            '{{ url_4 }}' => "{$uri}/1",
            '{{ url_5 }}' => "{$uri}/1"
        ];
    }
}
