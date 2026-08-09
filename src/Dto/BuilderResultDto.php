<?php

declare(strict_types=1);

namespace Strides\Module\Dto;

class BuilderResultDto
{
    public function __construct(
        public string $filePath,
        public string $content,
    ) {}
}
