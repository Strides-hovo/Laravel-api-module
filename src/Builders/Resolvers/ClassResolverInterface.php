<?php

declare(strict_types=1);

namespace Strides\Module\Builders\Resolvers;

interface ClassResolverInterface
{
    public function resolve(string $stub, string $moduleName, string $className): string;
}
