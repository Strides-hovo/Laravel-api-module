<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class RouteServiceProviderBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::route_service_provider;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.provider.route');
    }

    protected function getReplacements(): array
    {
        $key = Str::lower($this->moduleName);
        $config = Config::get($key);

        $versions = Arr::get($config, 'versions', []);
        $versions[$this->version] = ['enabled' => true, 'deprecated' => false];

        return array_merge(parent::getReplacements(), [
            '{{ routes_map }}' => $this->buildRoutesMap($versions),

        ]);
    }

    private function buildRoutesMap(array $versions): string
    {
        $blocks = [];
        $key = Str::lower($this->moduleName);

        foreach ($versions as $version => $data) {
            $path = ModuleHelper::normalizePath(ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::route, "api{$version}.php"));

            $blocks[] = <<<PHP
        if (config('{$key}.versions.{$version}.enabled')) {
            Route::prefix('api/{$version}')
                ->middleware('api')
                ->group(base_path('{$path}'));
        }
        PHP;
        }

        return implode("\n\n", $blocks);
    }
}
