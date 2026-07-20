<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Action;

class StoreClassResolver extends ActionsClassesResolver
{
    /**
     * store.stub: handle(array $data): {{ model }}
     * Нужна модель — тип возврата созданной сущности.
     */
    protected function getReplacements(string $moduleName, string $className): array
    {
        return [
            '{{ namespace }}' => $this->namespaceReplacement($moduleName),
            '{{ class }}' => $className,
            '{{ repository_use }}' => $this->repositoryUseReplacement($moduleName),
            '{{ repository_param }}' => $this->repositoryParamReplacement($moduleName),
            '{{ model }}' => $this->modelReplacement($moduleName),
        ];
    }
}
