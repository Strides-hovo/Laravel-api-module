<?php

declare(strict_types=1);

namespace Strides\Module\Builders;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class PolicyBuilder extends BaseBuilder
{
    protected function getStubPath(): string
    {
        return Config::get('module-stub.policy.main');
    }

    protected function getReplacements(): array
    {
        return array_merge(parent::getReplacements(), [
            '{{ body }}' => $this->getBody(),
        ]);
    }

    protected function getGeneratorKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::policy;
    }

    private function getBody(): string
    {
        $stubPath = Config::get('module-stub.policy.model');
        $stub = file_get_contents($stubPath);

        if ($stub === false) {
            return '';
        }

        $model = '';
        $guard = '';

        // @Todo Need to return the default user module
        if (! isset($this->options['model']) && ! isset($this->options['guard'])) {
            return '';
        }

        if (isset($this->options['model'])) {
            $model = $this->getRelation((string) $this->options['model']);
        }

        if (isset($this->options['guard'])) {
            $guard = $this->getRelation((string) $this->options['guard']);
        }

        return strtr($stub, [
            '{{ model }}' => $model,
            '{{ guard }}' => $guard,
        ]);
    }

    private function getRelation(string $entity): string
    {
        $model = Str::lower($entity);
        $namespace = '\\'.ModuleHelper::namespace($this->moduleName, BuilderKeysEnum::model, $entity);

        return "$namespace \$$model";
    }
}
