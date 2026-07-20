<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;

class MigrationBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.migration.main');
    }

    protected function getReplacements(): array
    {
        $table = $this->options['table'] ?? $this->moduleName;
        $action = 'create';
        $dropping = 'dropIfExists';
        $body = "\$table->id(); \n \$table->timestamps();";

        if (!Str::contains($this->fileName, 'create')) {
            $action = $dropping = 'table';
            $body = '// @Todo';
        }

        return [
            '{{ table }}' => $table,
            '{{ action }}' => $action,
            '{{ dropping }}' => $dropping,
            '{{ body }}' => $body,
        ];
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::migration;
    }
}
