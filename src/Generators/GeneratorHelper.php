<?php

namespace Strides\Module\Generators;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class GeneratorHelper
{
    public function getFilePath(string $key, string $moduleName, ?string $version): string
    {
        $buildKey = BuilderKeysEnum::getCaseByName($key);

        return ModuleHelper::path($moduleName, $buildKey).$this->getVersion($key, $version).'.'.($key === 'http' ? 'http' : 'php');
    }

    public function fileExists(string $key, string $moduleName, string $filePath): bool
    {
        if ($key === 'migration') {
            return self::migrationExists($moduleName);
        }
        if (in_array($key, $this->getMissingEntities(), true)) {
            return false;
        }

        return File::exists($filePath);
    }

    public function migrationExists(string $moduleName): bool
    {
        $table = 'create_'.Str::lower($moduleName);

        $dir = ModuleHelper::normalizePath(ModuleHelper::module($moduleName, ModuleHelper::generator(BuilderKeysEnum::migration)));
        if (! File::isDirectory($dir)) {
            return false;
        }

        $files = File::files($dir);

        foreach ($files as $fileInfo) {
            $filename = pathinfo($fileInfo->getFilename(), PATHINFO_FILENAME);
            if (Str::contains($filename, $table, true)) {
                return true;
            }
        }

        return false;
    }

    private function getMissingEntities(): array
    {
        return [
            'config', 'route_service_provider',
        ];
    }

    public function getVersion(string $key, ?string $version): ?string
    {
        $versionalKeys = [
            'controller',
            'route',
            'request',
            'resource',
            'transformer',
        ];

        if ($version && in_array($key, $versionalKeys)) {
            return $version;
        }

        return null;
    }
}
