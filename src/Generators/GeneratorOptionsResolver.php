<?php

declare(strict_types=1);

namespace Strides\Module\Generators;

use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\Factories\FileNameFactory;
use Strides\Module\ModuleHelper;

class GeneratorOptionsResolver
{
    /**
     * @return array<string, mixed>
     */
    public static function resolve(string $key, string $moduleName, array $generators): array
    {
        $modelName = FileNameFactory::make($moduleName, BuilderKeysEnum::model);

        return match ($key) {
            'factory', 'policy', 'repository' => ['model' => $modelName],
            'migration' => ['table' => Str::plural(ModuleHelper::singular(Str::lower($moduleName)))],

            'controller' => array_intersect_key(
                array_fill_keys(['request', 'action', 'service', 'resource', 'transformer'], true),
                $generators
            ),

            'model' => array_intersect_key(
                array_fill_keys(['migration', 'controller', 'policy', 'factory'], true),
                $generators
            ),

            'listener' => array_intersect_key(
                ['event' => FileNameFactory::make($moduleName, BuilderKeysEnum::event)],
                $generators
            ),

            'command' => array_intersect_key(
                ['name' => FileNameFactory::make($moduleName, BuilderKeysEnum::command)], // было ::event — похоже, опечатка copy-paste
                $generators
            ),

            default => [],
        };
    }
}
