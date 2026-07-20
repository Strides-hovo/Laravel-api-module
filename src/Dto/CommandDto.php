<?php

declare(strict_types=1);

namespace Strides\Module\Dto;

/**
 * Data transfer object encapsulating raw generation parameters and flags parsed from console commands.
 */
class CommandDto
{
    /**
     * Initialize the Command DTO.
     *
     * @param string|null $moduleName
     * @param string|null $fileName
     * @param array<string, mixed> $options
     */
    public function __construct(
        public ?string $moduleName,
        public ?string $fileName,
        public array $options = []
    ) {
    }

    /**
     * Create a new DTO instance from a raw state array.
     *
     * @param array<string, mixed> $data
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            moduleName: $data['moduleName'] ?? '',
            fileName: $data['fileName'] ?? '',
            options: $data['options'] ?? []
        );
    }

    /**
     * Export DTO state to an associative array representation.
     *
     * @return array{moduleName: string|null, fileName: string|null, options: array<string, mixed>}
     */
    public function toArray(): array
    {
        return [
            'moduleName' => $this->moduleName,
            'fileName' => $this->fileName,
            'options' => $this->options,
        ];
    }
}
