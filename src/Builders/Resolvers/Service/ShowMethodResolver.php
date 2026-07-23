<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Service;

class ShowMethodResolver extends ServiceMethodResolver
{
    /**
     * destroy.stub: destroy(int|string $id): bool — плейсхолдеров нет.
     */
    protected function getReplacements(string $moduleName): array
    {
        return [];
    }
}
