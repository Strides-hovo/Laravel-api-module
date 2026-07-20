<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Service;

use Strides\Module\ModuleHelper;

class StoreMethodResolver extends ServiceMethodResolver
{
    /**
     * store.stub: create(array $data): {{ model }} — нужна модель созданной сущности.
     */
    protected function getReplacements(string $moduleName): array
    {
        return [
            '{{ model }}' => ModuleHelper::modelFqcn($moduleName),
        ];
    }
}
