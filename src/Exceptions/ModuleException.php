<?php

namespace Strides\Module\Exceptions;

use Exception;

/**
 * Base custom exception for module-related errors, carrying an optional payload of fine-grained error details.
 */
class ModuleException extends Exception
{
    /**
     * @var array<string|int, mixed>
     */
    protected array $errors = [];

    /**
     * Initialize the module exception.
     *
     * @param  array<string|int, mixed>  $errors
     */
    public function __construct(string $message = '', int $code = 400, array $errors = [])
    {
        parent::__construct($message, $code);
        $this->errors = $errors;
    }

    /**
     * Get the payload containing detailed error messages.
     *
     * @return array<string|int, mixed>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}
