<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class ListenerBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.listener.main');
    }

    protected function getReplacements(): array
    {
        $event = 'object';
        if (!empty($this->options) && isset($this->options['event'])) {
            $event = '\\' . ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::event, $this->options['event']);
        }

        return array_merge(parent::getReplacements(), [
            '{{ event }}' => $event,
        ]);
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::listener;
    }
}
