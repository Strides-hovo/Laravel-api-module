<?php
declare(strict_types=1);

namespace Strides\Module;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
//use Illuminate\View\View;
use InvalidArgumentException;
use Strides\Module\Exceptions\FileGeneratorException;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class FileGenerator
{

    /**
     * @throws FileGeneratorException
     */
    public static function generate(array $contents): array
    {
        $statuses = [];
        try {
            foreach ($contents as $moduleKey => $content) {
                $fileContent = self::getContents($content['template'], $content['replacements']);
                self::mkDir($content['directory']);
                self::mkFile($content['fileName'], $fileContent);
                $status = Str::studly($moduleKey);
                $statuses[] = "{$status} [{$content['fileName']}]";
            }
        } catch (InvalidArgumentException  $e) {
            throw new FileGeneratorException($e->getMessage());
        }
        return $statuses;
    }


    /**
     * @param string $template
     * @param array $replacements
     * @return View
     */
    private static function getContents(string $template, array $replacements): View
    {
        return view("strides-module::{$template}", $replacements);
    }


    private static function mkDir(string $directory): void
    {
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
    }

    private static function mkFile(string $fileName, View $fileContent): void
    {
        File::put($fileName, $fileContent);
    }

}
