<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;

class ConfigBuilder extends BaseBuilder
{
    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::config;
    }

    protected function getStubPath(): string
    {
        return Config::get('module-stub.module.config');
    }

    protected function getReplacements(): array
    {

        $key = Str::lower($this->moduleName);
        $config = Config::get($key);

        $versions = Arr::get($config, 'versions', []);
        $versions[$this->version] = ['enabled' => true, 'deprecated' => false];

        return [
            '{{ module }}' => $this->moduleName,
            '{{ versions }}' => $this->exportVersions($versions),
        ];
    }

    private function exportVersions(array $versions): string
    {
        $lines = [];

        foreach ($versions as $key => $data) {
            $enabled = $data['enabled'] ? 'true' : 'false';
            $deprecated = $data['deprecated'] ? 'true' : 'false';
            $lines[] = "'{$key}' => ['enabled' => {$enabled}, 'deprecated' => {$deprecated}],";
        }

        return trim(implode("\n", $lines));
    }
}
