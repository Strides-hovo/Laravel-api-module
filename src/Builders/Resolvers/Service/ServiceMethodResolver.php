<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers\Service;

abstract class ServiceMethodResolver
{
    public function resolve(string $stub, string $moduleName): string
    {
        return strtr($stub, $this->getReplacements($moduleName));
    }

    /**
     * @return array<string, string>
     */
    abstract protected function getReplacements(string $moduleName): array;
}
