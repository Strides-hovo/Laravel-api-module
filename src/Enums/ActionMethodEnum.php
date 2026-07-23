<?php

declare(strict_types=1);

namespace Strides\Module\Enums;

enum ActionMethodEnum: string
{
    case index = 'Index';
    case store = 'Store';
    case update = 'Update';
    case destroy = 'Destroy';
    case show = 'Show';

    /**
     * Определяет метод экшена по имени класса (IndexAction, StoreAction, UpdateAction, DestroyAction).
     * Возвращает null для произвольных (кастомных) имён экшенов.
     */
    public static function fromClassName(string $className): ?self
    {
        foreach (self::cases() as $case) {
            if (str_ends_with($className, $case->value.'Action')) {
                return $case;
            }
        }

        return null;
    }
}
