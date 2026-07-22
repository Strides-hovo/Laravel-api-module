<?php

declare(strict_types=1);

namespace Strides\Module;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;

class ModuleHelper
{
    /**
     * Возвращает путь к папке сущности
     */
    public static function generator(BuilderKeysEnum $generatorKey): ?string
    {
        return Config::get("module.paths.generator.{$generatorKey->name}.path");
    }

    /**
     * Возвращает все генераторы
     */
    public static function generators(): array
    {
        $generators = Config::get('module.paths.generator');

        return array_filter($generators, fn ($g) => $g['generate']);
    }

    /**
     *  Возвращает Имя сущности в единственном числе (StudlyCase/snake_case сохраняется)
     *  Пример Strides\Module\Models\BlogPosts' -> 'BlogPost'
     */
    public static function singular(string $string): string
    {
        return Str::singular(class_basename($string));
    }

    /**
     *  Возвращает namespace по Модуле или по классу
     */
    public static function namespace(string $moduleName, ?BuilderKeysEnum $moduleKey = null, string $className = ''): string
    {
        $module = Config::get('module.namespace');
        $module = "$module/$moduleName";
        $namespace = $module.($moduleKey ? DIRECTORY_SEPARATOR.self::generator($moduleKey) : '');
        $namespace .= $className ? DIRECTORY_SEPARATOR.$className : '';

        return str_replace('/', '\\', $namespace);
    }

    /**
     *  Возвращает путь к модулю
     */
    public static function module(string $name, ?string $path = ''): string
    {
        $moduleDirectory = Config::get('module.paths.modules', 'Modules');
        $module = $moduleDirectory.DIRECTORY_SEPARATOR.$name;

        return $path ? $module.DIRECTORY_SEPARATOR.$path : $module;
    }

    public static function normalizePath(string $filePath): string
    {
        return str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $filePath);
    }

    /**
     * Имя класса репозитория модуля, например 'PostRepository'.
     */
    public static function repositoryClassName(string $moduleName): string
    {
        return self::singular($moduleName).'Repository';
    }

    /**
     * Строка `use ...;` для FQCN репозитория модуля.
     */
    public static function repositoryUseStatement(string $moduleName): string
    {
        $fqcn = self::namespace($moduleName, BuilderKeysEnum::repository, self::repositoryClassName($moduleName));

        return "use {$fqcn};";
    }

    /**
     * Параметр конструктора с типом репозитория модуля.
     */
    public static function repositoryParam(string $moduleName): string
    {
        return 'protected '.self::repositoryClassName($moduleName).' $repository';
    }

    /**
     * FQCN модели модуля с ведущим слешем, для использования как return type.
     */
    public static function modelFqcn(string $moduleName): string
    {
        return '\\'.self::namespace($moduleName, BuilderKeysEnum::model, $moduleName);
    }

    public static function path(string $moduleName, BuilderKeysEnum $moduleKey, ?string $fileName = null): string
    {

        $entityDir = self::generator($moduleKey);
        $fileName = $fileName ?: FileNameFactory::make($moduleName, $moduleKey);
        $result = $entityDir.DIRECTORY_SEPARATOR.$fileName;

        return self::normalizePath(self::module($moduleName, $result));
    }
}
