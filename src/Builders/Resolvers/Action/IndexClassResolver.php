<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Action;

class IndexClassResolver extends ActionsClassesResolver
{
    /**
     * index.stub: handle(array $data): \Illuminate\Support\Collection
     * Модель не нужна — тип возврата уже зашит в стабе.
     */
    protected function getReplacements(string $moduleName, string $className): array
    {
        return [
            '{{ namespace }}' => $this->namespaceReplacement($moduleName),
            '{{ class }}' => $className,
            '{{ repository_use }}' => $this->repositoryUseReplacement($moduleName),
            '{{ repository_param }}' => $this->repositoryParamReplacement($moduleName),
        ];
    }
}
