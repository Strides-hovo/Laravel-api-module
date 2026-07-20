<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Service;

class IndexMethodResolver extends ServiceMethodResolver
{
    /**
     * index.stub: filter(array $data): \Illuminate\Support\Collection — плейсхолдеров нет.
     */
    protected function getReplacements(string $moduleName): array
    {
        return [];
    }
}
