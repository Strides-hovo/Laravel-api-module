<?php

declare(strict_types=1);

namespace Strides\Module\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static array<string, bool> all() Получить все модули и их статус.
 * @method static array<int, string> allEnabled() Получить только имена включённых модулей.
 * @method static array<int, string> allDisabled() Получить только имена выключенных модулей.
 * @method static bool exists(string $moduleName) Проверить, зарегистрирован ли модуль и существует ли он физически.
 * @method static bool isEnabled(string $moduleName) Проверить, включён ли модуль.
 * @method static bool isDisabled(string $moduleName) Проверить, выключен ли модуль.
 * @method static bool enable(string $moduleName) Включить модуль.
 * @method static bool disable(string $moduleName) Выключить модуль.
 * @method static bool register(string $moduleName, bool $enabled = true) Добавить новый модуль в реестр.
 * @method static bool delete(string $moduleName) Удалить модуль из реестра и физически с диска.
 * @method static string path(string $moduleName) Получить абсолютный путь к папке модуля.
 * @method static string namespace(string $moduleName) Получить PSR-4 неймспейс модуля.
 * @method static int count() Получить количество зарегистрированных модулей.
 * @method static array scan() Получить реальные папки в папку Modules.
 * @method static ModuleDto|null get(string $moduleName) Получить полное описание модуля в виде объекта DTO.
 *
 * @see ModuleManager
 */
class Module extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'strides-module-manager';
    }
}
