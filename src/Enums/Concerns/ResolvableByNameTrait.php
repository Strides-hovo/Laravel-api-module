<?php

declare(strict_types=1);

namespace Strides\Module\Enums\Concerns;

use Strides\Module\Exceptions\BuilderException;

trait ResolvableByNameTrait
{
    /**
     * Находит case перечисления по его имени (без учёта регистра).
     */
    public static function getCaseByName(string $caseName): static
    {
        foreach (self::cases() as $case) {
            if (strcasecmp($case->name, $caseName) === 0) {
                return $case;
            }
        }

        throw new BuilderException("Noting Builder {$caseName}");
    }
}
