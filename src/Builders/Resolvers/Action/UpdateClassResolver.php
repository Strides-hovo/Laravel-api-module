<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Action;

class UpdateClassResolver extends ActionsClassesResolver
{
    /**
     * update.stub: handle(int|string $id, array $data): {{ model }}
     * Нужна модель — тип возврата обновлённой сущности.
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
