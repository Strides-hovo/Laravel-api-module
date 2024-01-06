<?php

namespace Strides\Module;

use DB;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Strides\Module\Exceptions\BuilderException;
use Strides\Module\Exceptions\MigrationException;
use Symfony\Component\ErrorHandler\Error\ClassNotFoundError;

trait MigrationHelper
{


    /**
     * Get the migration directory for the specified module.
     *
     * @param string $moduleName The name of the module for which the migration directory is obtained.
     * @return string The migration directory for the specified module.
     * @throws BuilderException
     */

    private function getMigrationDirectory(string $moduleName)
    {
        $dir = ModuleHelper::generator('migration');
        $moduleDir = ModuleHelper::module($moduleName, $dir);
        $start = strpos($moduleDir, Config::get('module.namespace'));

        return substr($moduleDir, $start);
    }


    /**
     * Generate options with prefixes for the provided array of options.
     *
     * @param array $options The array of options for which prefixes are generated.
     * @return array The array of options with prefixes.
     */
    private function getOptionsWithPrefix(array $options): array
    {
        $optionsWithPrefix = array_map(function ($val, $key) {
            return ["--{$key}" => $val ?? true];
        }, $options, array_keys($options));
        //сливаем в одно уровня
        return array_merge(...$optionsWithPrefix);
    }


    /**
     * Get migration options for all modules based on the specified key and options array.
     *
     * @param string $key The key for which options are obtained.
     * @param array $options The array of options provided to the migration command.
     * @param callable $facade The callback function to obtain specific module-related information.
     * @return array An array of configured migration options for all modules.
     */
    private function getMigrationOptionsForAllModules(string $key, array $options, callable $facade): array
    {
        //Получение списка названий всех модулей.
        $modulesNames = array_keys(ModuleHelper::getModulesNames());

        // Возвращаем настроенные опции для всех модулей.
        return array_map(function ($moduleName) use ($facade, $key, $options) {
            $options[$key] = call_user_func($facade, $moduleName);
            return $this->getOptionsWithPrefix($options);
        }, $modulesNames);
    }


    /**
     * Get the seed class name for the specified module.
     *
     * @param string $moduleName The name of the module for which the seed class name is obtained.
     * @return string The fully qualified seed class name.
     * @throws MigrationException If the seed class does not exist for the specified module.
     */
    private function getSeedClassName(string $moduleName): string
    {
        $namespace = Config::get('module.namespace');
        $class = "{$namespace}\\{$moduleName}\\Database\Seeders\\{$moduleName}Seeder";
        if (class_exists($class)) {
            return $class;
        }
        throw new MigrationException("class {$class} not exist for module {$moduleName}");
    }


    /**
     * Get the module name based on the provided options.
     *
     * @param array $option The options array provided to the migration command.
     * @return string The name of the module extracted from the options.
     * @throws \ErrorException If neither '--path' nor '--class' is present in the options.
     */
    public function getModuleNameByOption(array $option)
    {

        $modules = array_keys(ModuleHelper::getModulesNames());

        if (array_key_exists('--path', $option)) {
            $tree = explode(DIRECTORY_SEPARATOR, $option['--path']);
        } elseif (array_key_exists('--class', $option)) {
            $tree = explode('\\', $option['--class']);
        } else {
            throw new \ErrorException();
        }
        return implode('', array_intersect($tree, $modules));
    }


    /**
     * Validate the presence of a key in the options and perform additional checks.
     *
     * @param string $key The key to validate in the options array.
     * @param array $option The options array provided to the migration command.
     * @return bool Returns true if validation is successful.
     * @throws MigrationException If validation fails.
     * @throws FileNotFoundException If '--path' is present and the directory does not exist.
     * @throws ClassNotFoundError If '--class' is present and the class does not exist.
     */

    public function validate(string $key, array $option): bool
    {

        if (!array_key_exists($key, $option)) {
            throw new MigrationException();
        }
        if (array_key_exists('--path', $option)) {
            if (!is_dir($option['--path'])) {
                throw new FileNotFoundException('File Not Fount Exists ' . $option['--path']);
            }
            return true;
        } elseif (array_key_exists('--class', $option)) {
            if (!class_exists($option['--class'])) {
                throw new ClassNotFoundError('Class Not Fount Exists ' . $option['--class']);
            }
        }
        return false;
    }


    /**
     * Check if a table exists in the database.
     *
     * @param string $tableName The name of the table to check for existence.
     * @return bool Returns true if the table exists, false otherwise.
     */
    public function tableExists(string $tableName)
    {
        $subd = env('DB_CONNECTION');
        $database = config("database.connections.{$subd}.database");
        $result = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name = ?", [$database, $tableName]);
        return !empty($result);
    }


    /**
     * Get the table name based on the provided module name and options.
     *
     * @param string|null $moduleName The name of the module for which the table name is obtained.
     * @param array $option The options array provided to the migration command.
     * @return string The name of the table extracted from the options.
     */
    public function getTableName(?string $moduleName, array $option): string
    {
        if ($moduleName) {
            return Str::lcfirst(Str::plural($moduleName));
        }

        $_class = $option['--class'];
        $class = Str::afterLast($_class, '\\');
        $model = strstr($class, 'Seeder', true);
        return Str::lcfirst(Str::plural($model));
    }
}
