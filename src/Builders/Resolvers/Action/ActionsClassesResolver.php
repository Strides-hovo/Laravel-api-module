<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Action;

use Strides\Module\Builders\Resolvers\ClassResolverInterface;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

abstract class ActionsClassesResolver implements ClassResolverInterface
{
    public function resolve(string $stub, string $moduleName, string $className): string
    {
        return strtr($stub, $this->getReplacements($moduleName, $className));
    }

    /**
     * Каждый резолвер собирает свой набор плейсхолдеров под конкретный mini-стаб:
     * index/destroy не используют {{ model }}, store/update — используют.
     *
     * @return array<string, string>
     */
    abstract protected function getReplacements(string $moduleName, string $className): array;

    protected function namespaceReplacement(string $moduleName): string
    {
        return ModuleHelper::namespace($moduleName, BuilderKeysEnum::action);
    }

    protected function repositoryUseReplacement(string $moduleName): string
    {
        return ModuleHelper::repositoryUseStatement($moduleName);
    }

    protected function repositoryParamReplacement(string $moduleName): string
    {
        return ModuleHelper::repositoryParam($moduleName);
    }

    protected function modelReplacement(string $moduleName): string
    {
        return ModuleHelper::modelFqcn($moduleName);
    }
}
