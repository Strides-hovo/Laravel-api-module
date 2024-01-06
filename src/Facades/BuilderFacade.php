<?php

namespace Strides\Module\Facades;

use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

class BuilderFacade
{

    public static function getModelFileName(string $moduleName, string|null $fileName = ''): string
    {
        if (!$fileName) {
            return ModuleHelper::singular($moduleName);
        }
        $names = Str::ucsplit($fileName);
        return current($names);
    }


    public static function getOtherFileName(string $moduleName, BuilderKeysEnum $builderKey, string|null $fileName = ''): string
    {
        if (!$fileName) {
            return ModuleHelper::singular($moduleName) . Str::studly($builderKey->name);
        }
        $names = Str::ucsplit($fileName);
        if (count($names) > 1) {
            array_pop($names);
        }
        return implode('', $names) . Str::ucfirst($builderKey->name);
    }
}
