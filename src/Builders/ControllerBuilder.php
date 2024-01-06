<?php

namespace Strides\Module\Builders;

use Strides\Module\Contracts\BuilderOptionInterface;
use Strides\Module\Enums\BuilderKeysEnum;
use Strides\Module\ModuleHelper;

/**
 * Class ControllerBuilder
 *
 * The `ControllerBuilder` class is responsible for generating controller files with customizable options.
 * It extends the `AbstractBuilder` class and implements the `BuilderOptionInterface` for replacement customization.
 *
 */
class ControllerBuilder extends AbstractBuilder implements BuilderOptionInterface
{

    /**
     * Available options for controller generation.
     */
    const OPTIONS = [
        'request' => true,
        'resource' => true,
        'collection' => true,
        'repository' => true,
        'model' => true,
    ];

    /**
     * An array to store custom option values for customization.
     */
    private static array $option = [];


    /**
     * Get the builder key associated with the controller.
     *
     * @return BuilderKeysEnum The enumeration value representing the controller builder key.
     */
    protected function getBuilderKey(): BuilderKeysEnum
    {
        return BuilderKeysEnum::controller;
    }

    /**
     * Set custom option values for the controller builder.
     *
     * @param array $option An array of custom option values.
     */

    public static function setOption(array $option): void
    {
        self::$option = $option;
    }

    /**
     * Get the replacement values for customization.
     *
     * @return array An array of replacement values for customization.
     */
    protected function getReplacements(): array
    {
        if (array_key_exists('all', $this->replacements)) {
            $this->replacements = self::OPTIONS;
        }
        $keys = array_keys($this->getReplacementKeys([...$this->replacements, ...self::$option]));
        return array_merge(parent::getReplacements(), $this->getReplacementsByRelation($keys));

    }


    /**
     * Get the valid replacement keys based on the available options.
     *
     * @param array $args An array of replacement keys provided for customization.
     * @return array An array containing only valid replacement keys.
     */
    protected function getReplacementKeys(array $args): array
    {
        return ModuleHelper::filterByKeys(array_keys(self::OPTIONS), $args);
    }
}
