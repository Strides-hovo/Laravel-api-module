<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Service;

use Strides\Module\ModuleHelper;

class UpdateMethodResolver extends ServiceMethodResolver
{
    /**
     * update.stub: update(int|string $id, array $data): {{ model }} — нужна модель обновлённой сущности.
     */
    protected function getReplacements(string $moduleName): array
    {
        return [
            '{{ model }}' => ModuleHelper::modelFqcn($moduleName),
        ];
    }
}
