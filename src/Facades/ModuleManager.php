<?php

declare(strict_types=1);

namespace Strides\Module\Facades;

use Illuminate\Support\Facades\File;
use Strides\Module\Dto\ModuleDto;

class ModuleManager
{
    /**
     * All modules and their statuses.
     *
     * @return array<string, bool>
     */
    public static function all(): array
    {
        return self::readRegistry();
    }

    /**
     * Only the names of enabled modules.
     *
     * @return array<int, string>
     */
    public static function allEnabled(): array
    {
        return array_keys(array_filter(self::readRegistry(), fn (bool $enabled) => $enabled));
    }

    /**
     * Only the names of disabled modules.
     *
     * @return array<int, string>
     */
    public static function allDisabled(): array
    {
        return array_keys(array_filter(self::readRegistry(), fn (bool $enabled) => !$enabled));
    }

    /**
     * Check if the module is registered (exists in json) AND if the directory physically exists.
     * Both conditions are important — json without a directory or a directory without a json record means desynchronization.
     */
    public static function exists(string $moduleName): bool
    {
        $registered = array_key_exists($moduleName, self::readRegistry());
        $onDisk = File::isDirectory(self::path($moduleName));

        return $registered && $onDisk;
    }

    public static function isEnabled(string $moduleName): bool
    {
        return (self::readRegistry()[$moduleName] ?? false) === true;
    }

    public static function isDisabled(string $moduleName): bool
    {
        return !self::isEnabled($moduleName);
    }

    public static function enable(string $moduleName): bool
    {
        $registry = self::readRegistry();
        $registry[$moduleName] = true;

        return self::writeRegistry($registry);
    }

    public static function disable(string $moduleName): bool
    {
        $registry = self::readRegistry();
        $registry[$moduleName] = false;

        return self::writeRegistry($registry);
    }

    /**
     * Adds a new module to the registry. This should be called by the generator
     * (ModuleDirector) right after creating the module folder, otherwise the module
     * will exist on the disk, but all()/exists() will not know about it.
     */
    public static function register(string $moduleName, bool $enabled = true): bool
    {
        $registry = self::readRegistry();

        if (array_key_exists($moduleName, $registry)) {
            return false; // Already registered, do not overwrite silently
        }

        $registry[$moduleName] = $enabled;

        return self::writeRegistry($registry);
    }

    /**
     * Deletes the module both from the registry and physically from the disk.
     */
    public static function delete(string $moduleName): bool
    {
        $registry = self::readRegistry();
        unset($registry[$moduleName]);
        self::writeRegistry($registry);

        return File::deleteDirectory(self::path($moduleName));
    }

    /**
     * Absolute path to the module folder without building a full object.
     */
    public static function path(string $moduleName): string
    {
        return rtrim(config('module.paths.modules'), '/') . '/' . $moduleName;
    }

    /**
     * PSR-4 namespace of the module.
     */
    public static function namespace(string $moduleName): string
    {
        return config('module.namespace') . '\\' . $moduleName;
    }

    /**
     * Total number of registered modules.
     */
    public static function count(): int
    {
        return count(self::readRegistry());
    }

    /**
     * Full module description as a single object — path, namespace, status.
     * Returns null if the module exists neither in the registry nor on the disk.
     */
    public static function get(string $moduleName): ?ModuleDto
    {
        if (!self::exists($moduleName)) {
            return null;
        }

        return new ModuleDto(
            name: $moduleName,
            path: self::path($moduleName),
            namespace: self::namespace($moduleName),
            enabled: self::isEnabled($moduleName),
        );
    }

    public static function scan(): array
    {
        $basePath = config('module.modules');

        if (File::isDirectory($basePath)) {
            $absolutePaths = File::directories($basePath);

            return array_map(function ($path) {
                return basename($path);
            }, $absolutePaths);
        }

        return [];
    }

    private static function registryPath(): string
    {
        return config('module.modules_name');
    }

    /**
     * Reads the entire module registry from modules_name.json as is.
     *
     * @return array<string, bool> key is the module name, value is enabled/disabled status
     */
    private static function readRegistry(): array
    {
        $path = self::registryPath();

        if (!File::exists($path)) {
            return [];
        }

        return json_decode(File::get($path), true) ?? [];
    }

    /**
     * Overwrites the registry file completely.
     *
     * @param array<string, bool> $data
     */
    private static function writeRegistry(array $data): bool
    {
        return (bool)File::put(
            self::registryPath(),
            (string)json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }
}
