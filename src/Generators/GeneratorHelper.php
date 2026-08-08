<?php

namespace Strides\Module\Generators;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class GeneratorHelper
{


    public function getFileName(string $key, string $moduleName): string
    {
        $buildKey = BuilderKeysEnum::getCaseByName($key);

        return ModuleHelper::path($moduleName, $buildKey) . '.' . ($key === 'http' ? 'http' : 'php');
    }

    public function fileExists(string $key, string $moduleName): bool
    {

        $file = $this->getFileName($key, $moduleName);

        if ($key === 'migration') {
            return self::migrationExists($moduleName);
        }

        return File::exists($file);
    }

    public function migrationExists(string $moduleName): bool
    {
        $table = 'create_' . Str::lower($moduleName);

        $dir = ModuleHelper::normalizePath(ModuleHelper::module($moduleName, ModuleHelper::generator(BuilderKeysEnum::migration)));
        if (!File::isDirectory($dir)) {
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
}
