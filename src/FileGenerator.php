<?php

declare(strict_types=1);

namespace Strides\Module;

use Illuminate\Support\Facades\File;
use Strides\Module\Contracts\FileGeneratorInterface;

class FileGenerator implements FileGeneratorInterface
{
    public function generate(string $filePath, string $content): string
    {
        self::mkDir(dirname($filePath));
        self::mkFile($filePath, $content);

        PintFormatter::format([$filePath]);

        return $filePath;
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
