<?php

namespace Strides\Module\Builders;

use Illuminate\Support\Str;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

/**
 * Class MigrationBuilder
 *
 * The `MigrationBuilder` class is responsible for generating migration files with customizable options.
 * It extends the `AbstractBuilder` class and provides functionality for setting the model name and defining replacements.
 *
 */
class MigrationBuilder extends AbstractBuilder
{
    /**
     * The model name to be used in the migration file.
     */
    private static string $modelName;


    /**
     * Set the model name for the migration.
     *
     * @param string $modelName The name of the model associated with the migration.
     */
    public static function setModelName(string $modelName): void
    {
        self::$modelName = $modelName;
    }

    /**
     * Get the builder key associated with the migration.
     */

    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::migration;
    }

    /**
     * Get the replacement values for customization.
     *
     * @return array An array of replacement values for customization.
     */

    protected function getReplacements(): array
    {
        if (!isset(self::$modelName)) return [];
        return [
            'table' => Str::plural(Str::snake(ModuleHelper::singular(self::$modelName)))
        ];
    }

    /**
     * Get the template name to be used for the migration file.
     *
     * @return string The template name for the migration file.
     */

    protected function getTemplate(): string
    {
        return isset(self::$modelName) ? 'migration.new' : 'migration.empty';
    }

    /**
     * Get the filename for the migration file.
     *
     * @return string The filename for the migration file.
     */
    protected function getFileName(): string
    {
        $timestamp = date('Y_m_d_His');
        $module = ModuleHelper::singular($this->moduleName);
        $snakeTableName = Str::plural(Str::snake(self::$modelName ?? $module));
        if (isset(self::$modelName)) {
            return $timestamp . "_create_{$snakeTableName}_table";
        }

        return $timestamp . "_{$this->fileName}";
    }

}
