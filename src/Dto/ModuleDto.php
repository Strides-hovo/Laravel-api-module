<?php

declare(strict_types=1);

namespace Strides\Module\Dto;

final class ModuleDto
{
    public function __construct(
        public readonly string $name,
        public readonly string $path,
        public readonly string $namespace,
        public readonly bool $enabled,
    ) {
    }
}
