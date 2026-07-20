<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers;

interface MethodResolverInterface
{
    public function resolve(string $stub, string $moduleName, array $relations): string;
}
