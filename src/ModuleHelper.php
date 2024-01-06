<?php
declare(strict_types=1);

namespace Strides\Module;

use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Exceptions\BuilderException;

class ModuleHelper
{
    /**
     * @param string $string
     * @return string returned singular for string
     */
    public static function singular(string $string): string
    {
        return Str::singular(class_basename($string));
    }


    /**
     * @param string $name
     * @param string|null $path
     * @return string returns the path to the module from the directory
     * @throws BuilderException
     */
    public static function module(string $name, string|null $path = ''): string
    {
        try {
            $moduleDirectory = Config::get('module.paths.modules');
            $module = $moduleDirectory . DIRECTORY_SEPARATOR . $name;
        } catch (Exception $e) {
            throw new BuilderException('Module path is not exists');
        }

        return $module . ($path ? DIRECTORY_SEPARATOR . $path : $path);
    }


    /**
     * @param string $generatorKey
     * @return string|null возврашает конкретный пут по ключу
     */

    public static function generator(string $generatorKey): string|null
    {
        return Config::get("module.paths.generator.{$generatorKey}.path");
    }

    /**
     * @return array возврашает все генератроы
     */
    public static function generators(array $generators): array
    {

        return array_filter($generators, fn($g) => $g['generate']);
    }

    /**
     * @param string $moduleName
     * @param BuilderKeysEnum|null $moduleKey
     * @param string $className
     * @return string returned namespace to dir | to file
     */

    public static function namespace(string $moduleName, ?BuilderKeysEnum $moduleKey = null, string $className = ''): string
    {
        $module = Config::get("module.namespace");
        $module = "$module/$moduleName";
        $namespace = $module . ($moduleKey ? DIRECTORY_SEPARATOR . self::generator($moduleKey->name) : $moduleKey);
        $namespace .= $className ? DIRECTORY_SEPARATOR . $className : $className;
        return str_replace('/', '\\', $namespace);
    }


    public static function filterByKeys(array $keys, array $array): array
    {
        return array_intersect_key($array, array_flip($keys));
    }


    public static function getModulesNames(): array
    {
        $modules_names_config = Config::get('module.modules_name');
        if (File::exists($modules_names_config)) {
            $file = File::get($modules_names_config);
            return json_decode($file, true) ?: [];
        }
        return [];
    }


    public static function addModulesName(string $moduleName): bool
    {
        $names = [];
        $modules_names_config = Config::get('module.modules_name');
        if (File::exists($modules_names_config)) {
            $file = File::get($modules_names_config);
            $names = json_decode($file, true);
        }
        $names[$moduleName] = true;
        $contents = json_encode($names, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return boolval(File::put($modules_names_config, $contents));
    }
}
