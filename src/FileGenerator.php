<?php

declare(strict_types=1);

namespace Strides\Module;

use Illuminate\Support\Facades\File;

class FileGenerator
{
    public function generate(string $dirName, string $fileName, string $content): string
    {

        self::mkDir($dirName);

        self::mkFile($fileName, $content);
        PintFormatter::format([$fileName]);

        return $dirName.DIRECTORY_SEPARATOR.basename($fileName);
    }

    private static function mkDir(string $directory): void
    {
        if (! File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
    }

    private static function mkFile(string $fileName, string $fileContent): void
    {
        File::put($fileName, $fileContent);
    }
}
