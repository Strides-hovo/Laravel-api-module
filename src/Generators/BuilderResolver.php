<?php

declare(strict_types=1);

namespace Strides\Module\Generators;

use Illuminate\Contracts\Container\BindingResolutionException;
use Strides\Module\Builders\BaseBuilder;
use Strides\Module\Dto\CommandDto;
use Strides\Module\Enums\BuilderClassNameEnum;
use Strides\Module\Exceptions\BuilderException;

class BuilderResolver
{
    /**
     * @throws BindingResolutionException
     */
    public static function make(BuilderClassNameEnum $classNameEnum, CommandDto $dto, array $parameters = []): BaseBuilder
    {
        return app()->makeWith($classNameEnum->value, [
            'dto' => $dto,
            CommandDto::class => $dto,
            ...$parameters,
        ]);
    }

    /**
     * Возвращает null, если для ключа нет класса-билдера (это нормально —
     * например, 'route', 'contract', 'http' — просто папки без контента).
     */
    public static function tryGetClass(string $key): ?BuilderClassNameEnum
    {
        try {
            return BuilderClassNameEnum::getCaseByName($key);
        } catch (BuilderException) {
            return null;
        }
    }
}
