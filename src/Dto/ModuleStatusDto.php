<?php

declare(strict_types=1);

namespace Strides\Module\Dto;

class ModuleStatusDto
{
    public function __construct(
        public string $key,
        public string $message,
        public string $status
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            key: $data['key'],
            message: $data['message'],
            status: $data['status'],
        );
    }
}
